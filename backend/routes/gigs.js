const express = require('express');
const Gig = require('../models/Gig');
const { auth, requireRole } = require('../middleware/auth');
const router = express.Router();

// Create a new gig (Clients only)
router.post('/', auth, requireRole(['client']), async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      skillsRequired,
      budget,
      duration,
      location
    } = req.body;

    console.log('Creating gig with data:', {
      title,
      category,
      budget,
      client: req.user._id
    });

    const gig = new Gig({
      title,
      description,
      category,
      skillsRequired,
      budget,
      duration,
      location,
      client: req.user._id
    });

    await gig.save();
    
    // Populate client details
    await gig.populate('client', 'name profilePicture');

    console.log('Gig created successfully:', gig._id);

    res.status(201).json({
      success: true,
      message: 'Gig created successfully',
      gig
    });

  } catch (error) {
    console.error('Create gig error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating gig',
      error: error.message
    });
  }
});

// Get all gigs (with filtering and pagination)
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      skills,
      location,
      budgetMin,
      budgetMax,
      search
    } = req.query;

    const query = { status: 'active' };

    // Build filter query
    if (category) query.category = category;
    if (location) query.location = new RegExp(location, 'i');
    if (skills) query.skillsRequired = { $in: skills.split(',') };
    if (budgetMin || budgetMax) {
      query['budget.amount'] = {};
      if (budgetMin) query['budget.amount'].$gte = parseInt(budgetMin);
      if (budgetMax) query['budget.amount'].$lte = parseInt(budgetMax);
    }
    if (search) {
      query.$or = [
        { title: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') }
      ];
    }

    const gigs = await Gig.find(query)
      .populate('client', 'name profilePicture')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Gig.countDocuments(query);

    console.log(`Found ${gigs.length} gigs`);

    res.json({
      success: true,
      gigs,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });

  } catch (error) {
    console.error('Get gigs error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching gigs',
      error: error.message
    });
  }
});

// Get single gig by ID
router.get('/:id', async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id)
      .populate('client', 'name profilePicture')
      .populate('assignedFreelancer', 'name profilePicture');

    if (!gig) {
      return res.status(404).json({
        success: false,
        message: 'Gig not found'
      });
    }

    res.json({
      success: true,
      gig
    });

  } catch (error) {
    console.error('Get gig error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching gig',
      error: error.message
    });
  }
});

// Update gig (Client only)
router.put('/:id', auth, requireRole(['client']), async (req, res) => {
  try {
    const gig = await Gig.findOne({ 
      _id: req.params.id, 
      client: req.user._id 
    });

    if (!gig) {
      return res.status(404).json({
        success: false,
        message: 'Gig not found or access denied'
      });
    }

    const allowedUpdates = [
      'title', 'description', 'category', 'skillsRequired', 
      'budget', 'duration', 'location', 'status'
    ];
    
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        gig[field] = req.body[field];
      }
    });

    await gig.save();
    await gig.populate('client', 'name profilePicture');

    res.json({
      success: true,
      message: 'Gig updated successfully',
      gig
    });

  } catch (error) {
    console.error('Update gig error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating gig'
    });
  }
});

// Delete gig (Client only)
router.delete('/:id', auth, requireRole(['client']), async (req, res) => {
  try {
    const gig = await Gig.findOneAndDelete({ 
      _id: req.params.id, 
      client: req.user._id 
    });

    if (!gig) {
      return res.status(404).json({
        success: false,
        message: 'Gig not found or access denied'
      });
    }

    res.json({
      success: true,
      message: 'Gig deleted successfully'
    });

  } catch (error) {
    console.error('Delete gig error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting gig'
    });
  }
});

// Get client's gigs
router.get('/client/my-gigs', auth, requireRole(['client']), async (req, res) => {
  try {
    const gigs = await Gig.find({ client: req.user._id })
      .populate('assignedFreelancer', 'name profilePicture')
      .sort({ createdAt: -1 });

    console.log(`Found ${gigs.length} gigs for client ${req.user._id}`);

    res.json({
      success: true,
      gigs
    });

  } catch (error) {
    console.error('Get client gigs error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching gigs',
      error: error.message
    });
  }
});

module.exports = router;