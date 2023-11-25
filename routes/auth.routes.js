const authController = require("../controllers/auth.controller");
const authUser = require("../middlewares/auth.middleware");

module.exports = (app) => {
    app.post(
        "/app/api/v1/auth/signup",
        [authUser.validateSignupRequest], //db calls all in one place
        authController.register
    ); 

    app.post(
        "/app/api/v1/auth/signin",
        [authUser.validateSigninRequest], //db calls all in one place
        authController.login
    ); 
    // app.get(
    //     "/app/api/v1/ip",
    //     // [authUser.validateSigninRequest],
    //     authController.getClientDetails
    // );
    // app.get(
    //     "/app/api/v1/server",
    //     // [authUser.validateSigninRequest],
    //     authController.getServerDetails
    // );
};
