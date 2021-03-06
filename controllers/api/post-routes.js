const router = require('express').Router();
const sequelize = require('../../config/connection');
const { Post, User, Comment } = require('../../models');
const withAuth = require('../../utils/auth');

// get all users  /api/posts
router.get('/', (req, res) => {
  console.log('======================');
  Post.findAll({
    attributes: [
      'id',
      'content',
      'post_url',
      'property_type',
      'loan_type',
      'down_payment',
      'credit_score',
      'employment',
      'condition',
      'created_at',
    ],
    include: [
      {
        model: Comment,
        attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
        include: {
          model: User,
          attributes: ['username' ]
        }
      },
      {
        model: User,
        attributes: ['username', 'email', 'license_number', 'phone_number', 'mortgage_name']
      }
    ]
  })
    .then(dbPostData => res.json(dbPostData))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get('/:id', (req, res) => {
  Post.findOne({
    where: {
      id: req.params.id
    },
    attributes: [
      'id',
      'content',
      'post_url',
      'property_type',
      'loan_type',
      'down_payment',
      'credit_score',
      'employment',
      'condition',
      'created_at',
    ],
    include: [
      {
        model: Comment,
        attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
        include: {
          model: User,
          attributes: ['username', 'email', 'license_number', 'phone_number', 'mortgage_name']
        }
      },
      {
        model: User,
        attributes: ['username', 'email', 'license_number', 'phone_number', 'mortgage_name']
      }
    ]
  })
    .then(dbPostData => {
      if (!dbPostData) {
        res.status(404).json({ message: 'No post found with this id' });
        return;
      }
      res.json(dbPostData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.post('/', withAuth, (req, res) => {
  // expects {title: 'Taskmaster goes public!', post_url: 'https://taskmaster.com/press', user_id: 1}
  Post.create({
    post_url: req.body.post_url,
    content: req.body.content,
    property_type: req.body.property_type,
    loan_type: req.body.loan_type,
    down_payment: req.body.down_payment,
    credit_score: req.body.credit_score,
    employment: req.body.employment,
    condition: req.body.condition,
    user_id: req.session.user_id
  })
    .then(dbPostData => res.json(dbPostData))
    console.log(dbPostData)
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});



router.put('/:id', withAuth, (req, res) => {
  Post.update(
    {
      post_url: req.body.post_url,
      content: req.body.content,
      property_type: req.body.property_type,
      loan_type: req.body.loan_type,
      down_payment: req.body.down_payment,
      credit_score: req.body.credit_score,
      employment: req.body.employment,
      condition: req.body.condition,
      user_id: req.session.user_id
    },
    {
      where: {
        id: req.params.id
      }
    }
  )
    .then(dbPostData => {
      if (!dbPostData) {
        res.status(404).json({ message: 'No post found with this id' });
        return;
      }
      res.json(dbPostData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.delete('/:id', withAuth, (req, res) => {
  console.log('id', req.params.id);
  Post.destroy({
    where: {
      id: req.params.id
    }
  })
    .then(dbPostData => {
      if (!dbPostData) {
        res.status(404).json({ message: 'No post found with this id' });
        return;
      }
      res.json(dbPostData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;
