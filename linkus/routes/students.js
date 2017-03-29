const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const Student = require('../models/student');

/// Register
router.post('/register', (req, res, next) => {
  let newStudent = new Student({

  	Student_Name: req.body.Student_Name,
  	Email_ID: req.body.Email_ID,
  	username: req.body.username,
  	Pwd: req.body.Pwd,
    Student_ID: req.body.Student_ID,
    DOB: req.body.DOB,
    Address: req.body.Address,
    Mobile_No: req.body.Mobile_No,
    Orgn_ID: req.body.Orgn_ID,
    Dept_ID: req.body.Dept_ID
    


  	});

  Student.addStudent(newStudent, (err, student)=> {
  		if(err){
      res.json({success: false, msg:'Failed to register '});
    } else {
      res.json({success: true, msg:'Student registered'});
    }
  });
});




// Authenticate
router.post('/authenticate', (req, res, next) => {
  const username = req.body.username;
  const Pwd = req.body.Pwd;

  Student.getStudentByUsername(username, (err,student)=>{
    if(err) throw err;
    if(!student){
      return res.json({success: false, msg: 'User not found!'})
    }

    Student.comparePwd(Pwd, student.Pwd, (err,isMatch)=>{
      if(err) throw err;
      if(isMatch){
        const token = jwt.sign(student, config.secret,{
          expiresIn: 604800 //1 week
        });
        //this way is safer coz doesn't inc pass
        res.json({
          success: true,
          token: 'JWT '+token,
          student: {
            id: student._id,
            Student_Name: student.Student_Name,
            Email_ID: student.Email_ID
          }
        });
      } else {
        return res.json({success: false, msg: 'Wrong password'});
      }

      });
    });
  });



// Profile
router.get('/profile', passport.authenticate('jwt', {session:false}), (req, res, next) => {
  res.json({students: req.students});
});

module.exports = router;
