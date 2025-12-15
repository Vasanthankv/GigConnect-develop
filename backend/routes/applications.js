const express = require('express');
const Application = require('../models/Application');
const Gig = require('../models/Gig');
const { auth, requireRole } = require('../middleware/auth');
const router = express.Router();

// Apply to a gig (Freelancers only)
router.post('/:gigId/apply', auth, requireRole(['freelancer']), async (req, res) => {
  try {
    const { proposal, bidAmount, estimatedDays, coverLetter } = req.body;
    const gigId = req.params.gigId;

    // Check if gig exists and is active
    const gig = await Gig.findById(gigId);
    if (!gig) {
      return res.status(404).json({
        success: false,
        message: 'Gig not found'
      });
    }

    if (gig.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'This gig is no longer accepting applications'
      });
    }

    // Check if user already applied
    const existingApplication = await Application.findOne({
      gig: gigId,
      freelancer: req.user._id
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied to this gig'
      });
    }

    // Validate bid amount
    if (bidAmount < 1) {
      return res.status(400).json({
        success: false,
        message: 'Bid amount must be positive'
      });
    }

    // Validate estimated days
    if (estimatedDays < 1) {
      return res.status(400).json({
        success: false,
        message: 'Estimated days must be at least 1'
      });
    }

    // Create application
    const application = new Application({
      gig: gigId,
      freelancer: req.user._id,
      proposal,
      bidAmount,
      estimatedDays,
      coverLetter: coverLetter || ''
    });

    await application.save();

    // Populate application with user data
    await application.populate('freelancer', 'name profilePicture skills email');

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      application
    });

  } catch (error) {
    console.error('Apply to gig error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while applying to gig'
    });
  }
});

// Get applications for a specific gig (Client only)
router.get('/gig/:gigId', auth, requireRole(['client']), async (req, res) => {
  try {
    const gigId = req.params.gigId;

    // Verify client owns the gig
    const gig = await Gig.findOne({ _id: gigId, client: req.user._id });
    if (!gig) {
      return res.status(404).json({
        success: false,
        message: 'Gig not found or access denied'
      });
    }

    // Get applications using the Application model
    const applications = await Application.find({ gig: gigId })
      .populate('freelancer', 'name profilePicture skills location bio email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      applications,
      gig: {
        _id: gig._id,
        title: gig.title,
        status: gig.status
      }
    });

  } catch (error) {
    console.error('Get gig applications error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching applications'
    });
  }
});

// Get freelancer's applications
router.get('/my-applications', auth, requireRole(['freelancer']), async (req, res) => {
  try {
    const applications = await Application.find({ freelancer: req.user._id })
      .populate({
        path: 'gig',
        populate: {
          path: 'client',
          select: 'name profilePicture email'
        }
      })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      applications
    });

  } catch (error) {
    console.error('Get my applications error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching applications'
    });
  }
});

// Get client's all applications across all gigs
router.get('/client/my-applications', auth, requireRole(['client']), async (req, res) => {
  try {
    // Get all gigs by this client
    const clientGigs = await Gig.find({ client: req.user._id }).select('_id title status');
    const gigIds = clientGigs.map(gig => gig._id);

    // Get all applications for these gigs
    const applications = await Application.find({ gig: { $in: gigIds } })
      .populate('freelancer', 'name profilePicture skills location bio email')
      .populate('gig', 'title status')
      .sort({ createdAt: -1 });

    // Group by gig
    const applicationsByGig = {};
    applications.forEach(app => {
      if (!applicationsByGig[app.gig._id]) {
        applicationsByGig[app.gig._id] = {
          gig: app.gig,
          applications: []
        };
      }
      applicationsByGig[app.gig._id].applications.push(app);
    });

    res.json({
      success: true,
      applications,
      applicationsByGig: Object.values(applicationsByGig),
      clientGigs,
      totalApplications: applications.length
    });

  } catch (error) {
    console.error('Get client applications error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching applications'
    });
  }
});

// Accept application (Client only)
router.put('/:applicationId/accept', auth, requireRole(['client']), async (req, res) => {
  try {
    const applicationId = req.params.applicationId;

    // Find application and verify client owns the gig
    const application = await Application.findById(applicationId)
      .populate('gig');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Verify client owns the gig
    const gig = await Gig.findOne({ 
      _id: application.gig._id, 
      client: req.user._id 
    });

    if (!gig) {
      return res.status(403).json({
        success: false,
        message: 'Access denied - you do not own this gig'
      });
    }

    if (application.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Application is not in pending status'
      });
    }

    // Update application status
    application.status = 'accepted';
    await application.save();

    // Update gig status and assign freelancer
    await Gig.findByIdAndUpdate(application.gig._id, {
      status: 'in-progress',
      assignedFreelancer: application.freelancer
    });

    // Reject all other applications for this gig
    await Application.updateMany(
      {
        gig: application.gig._id,
        _id: { $ne: applicationId },
        status: 'pending'
      },
      { status: 'rejected' }
    );

    // Populate the updated application
    await application.populate('freelancer', 'name profilePicture skills email');

    res.json({
      success: true,
      message: 'Application accepted successfully',
      application
    });

  } catch (error) {
    console.error('Accept application error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while accepting application'
    });
  }
});

// Reject application (Client only)
router.put('/:applicationId/reject', auth, requireRole(['client']), async (req, res) => {
  try {
    const applicationId = req.params.applicationId;

    // Find application and verify client owns the gig
    const application = await Application.findById(applicationId)
      .populate('gig');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Verify client owns the gig
    const gig = await Gig.findOne({ 
      _id: application.gig._id, 
      client: req.user._id 
    });

    if (!gig) {
      return res.status(403).json({
        success: false,
        message: 'Access denied - you do not own this gig'
      });
    }

    if (application.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Application is not in pending status'
      });
    }

    application.status = 'rejected';
    await application.save();

    // Populate the updated application
    await application.populate('freelancer', 'name profilePicture skills email');

    res.json({
      success: true,
      message: 'Application rejected successfully',
      application
    });

  } catch (error) {
    console.error('Reject application error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while rejecting application'
    });
  }
});

// Withdraw application (Freelancer only)
router.put('/:applicationId/withdraw', auth, requireRole(['freelancer']), async (req, res) => {
  try {
    const applicationId = req.params.applicationId;

    const application = await Application.findOne({
      _id: applicationId,
      freelancer: req.user._id
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    if (application.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Cannot withdraw application in current status'
      });
    }

    application.status = 'withdrawn';
    await application.save();

    res.json({
      success: true,
      message: 'Application withdrawn successfully'
    });

  } catch (error) {
    console.error('Withdraw application error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while withdrawing application'
    });
  }
});

// Get application statistics
router.get('/stats', auth, async (req, res) => {
  try {
    let stats = {};

    if (req.user.role === 'freelancer') {
      const applications = await Application.find({ freelancer: req.user._id });
      stats = {
        total: applications.length,
        pending: applications.filter(app => app.status === 'pending').length,
        accepted: applications.filter(app => app.status === 'accepted').length,
        rejected: applications.filter(app => app.status === 'rejected').length,
        withdrawn: applications.filter(app => app.status === 'withdrawn').length
      };
    } else if (req.user.role === 'client') {
      const clientGigs = await Gig.find({ client: req.user._id });
      const gigIds = clientGigs.map(gig => gig._id);
      
      const applications = await Application.find({ gig: { $in: gigIds } });
      stats = {
        total: applications.length,
        pending: applications.filter(app => app.status === 'pending').length,
        accepted: applications.filter(app => app.status === 'accepted').length,
        rejected: applications.filter(app => app.status === 'rejected').length,
        withdrawn: applications.filter(app => app.status === 'withdrawn').length
      };
    }

    res.json({
      success: true,
      stats
    });

  } catch (error) {
    console.error('Get application stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching application statistics'
    });
  }
});

// Debug endpoint to see all applications
router.get('/debug/all', async (req, res) => {
  try {
    const applications = await Application.find()
      .populate('freelancer', 'name email')
      .populate('gig', 'title client')
      .populate('gig.client', 'name email')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      total: applications.length,
      applications
    });
  } catch (error) {
    console.error('Debug error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;