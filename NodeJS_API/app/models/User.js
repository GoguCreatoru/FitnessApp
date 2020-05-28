module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("user", {
      firstname: {
        type: Sequelize.STRING
      },
      lastname: {
        type: Sequelize.STRING
      },
      username: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      facebook_id: {
        type: Sequelize.STRING
      },
      facebook_token: {
        type: Sequelize.STRING
      },
      facebook_name: {
        type: Sequelize.STRING
      },
      google_id: {
        type: Sequelize.STRING
      },
      google_token: {
        type: Sequelize.STRING
      },
      google_name: {
        type: Sequelize.STRING
      }
    });
  
    return User;
  };