
const db = require("./index");
const authHelpers = require("../auth/helpers");
const passport = require("../auth/local");

const getUserPhotos = (req, res, next) => {
  db
    .any('select * from photos full join users on photos.user_ID = users.id where username = ${username}', req.user)
    .then(data => {
      res.status(200).json({
        status: 'success',
        data: data,
        message: 'Retrieved all users\'s photos'
      });
    })
    .catch(err => next(err))
}

const followUser = (req, res, next) => {
  db
    .none('insert into follows (user_ID, follower_ID) values ($userid}, ${followid})', {userid, followid})
    .then(() => {
      res.send('Follow success')
    })
    .catch(err => next(err))
}

const getUserFollowers = (req, res, next) => {
  console.log('here', req.user)
  // db
    // .any('select * from follows where follower_ID = ${id}', req.user)
    // .then(data => {
    //   res.status(200).json({
    //     status: 'success',
    //     data: data,
    //     message: 'Retrieved all users\'s followes'
    //   });
    // })
    // .catch(err => next(err))
}

const getUserFollowing = (req, res, next) => {
  db
    .any('select * from follows where username = ${username}', req.user)
    .then(data => {
      res.status(200).json({
        status: 'success',
        data: data,
        message: 'Retrieved all users\'s following'
      });
    })
    .catch(err => next(err))
}

const getFollowingPhotos = (req, res, next) => {
  console.log("hi", req.user)
  db
    // .any('select * from photos full join follows on photos.user_ID = follows.user_ID full join users on follows.user_ID = users.id where follower_ID=${userid}', req.user)
    .any('select * from photos full join follows on photos.user_ID = follows.user_ID full join users on follows.user_ID = users.id', req.user)
    .then(data => {
      res.status(200).json({
        status: 'success',
        data: data,
        message: 'Retrieved all following photos'
      })
    })
    .catch(err => next(err))
}

const getPhotoLikes = (req, res, next) => {
  db
    .any('select * from likes where photo_ID = ${photoid}', { photoid: photo.id })
    .then(data => {
      res.status(200).json({
        status: 'success',
        data: data,
        message: 'Retrieved ALL photo likes'
      })
    })
    .catch(err => next(err))
}

const uploadPhoto = (req, res, next) => {
  db
    .none('insert into photos (user_ID, url) values (${userID}, ${url})', req.body)
    .then(() => {
      res.send('Photo successfully uploaded.')
    })
    .catch(err => {
      res.status(500).send('Error uploading photo')
    })
}

const likePhoto = (req, res, next) => {
  db.
    none('insert into likes (user_ID, photo_ID) values (${userid}, ${photoid})', req.body)
}

function getSingleUser(req, res, next) {
  db
    .any("select * from users where username=${username}", req.user)
    .then(function (data) {
      res.status(200).json({
        status: "success",
        data: data,
        message: "Retrieved single users"
      });
    })
    .catch(err => next(err))
}

function loginUser(req, res, next) {

    passport.authenticate("local", (err, user, info) => {
      if (err) {
        res.status(500).send("error while trying to log in");
      } else if (!user) {
        res.status(401).send("invalid username/password");
      } else if (user) {
          console.log('after')
        req.logIn(user, function(err) {
          if (err) {
              console.log('error')
            res.status(500).send("error");
          } else {
              console.log('now')
            res.status(200).send(user);
          }
        });
      }
    })(req, res, next);
}

function logoutUser(req, res, next) {
  req.logout();
  res.status(200).send("log out success");
}

function registerUser(req, res, next) {
  return authHelpers
    .createUser(req)
    .then(response => {
      passport.authenticate("local", (err, user, info) => {
        if (user) {
          res.status(200).json({
            status: "success",
            data: user,
            message: "Registered one user"
          });
        }
      })(req, res, next);
    })
    .catch(err => {
      console.log(error)
      res.status(500).json({
        status: "error",
        error: err
      });
    });
}

module.exports = {
  getUserPhotos,
  followUser,
  getUserFollowers,
  getUserFollowing,
  getFollowingPhotos,
  getPhotoLikes,
  uploadPhoto,
  likePhoto,
  getSingleUser,
  registerUser,
  loginUser,
  logoutUser,
};
