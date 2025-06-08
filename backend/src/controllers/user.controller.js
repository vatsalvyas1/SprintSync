import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import User from "../models/user.model.js";

const generateAccessTokenAndRefreshToken = async function (userId) {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(200, "Something went wrong while generating tokens");
    }
};

const registerUser = asyncHandler(async function (req, res) {
    //  get user details from frontend
    //  validation - not empty
    //  check if user already exists
    //  create user object
    //  remove password and refresh token field from response
    //  check if user created
    //  return response

    const { name, role, email, password } = req.body;

    if ([name, role, email, password].some((field) => field?.trim() === "")) {
        throw new ApiError(200, "All fields are required.");
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) throw new ApiError(200, "User already exists.");

    const user = await User({
        name,
        role,
        email,
        password,
    });

    console.log(user._id);

    try {
        await user.validate(); // errors are caught in a controlled try-catch block
        await user.save();
    } catch (error) {
        const firstError =
            error.errors.email ||
            error.errors.password ||
            error.errors.name ||
            error.errors.role;

        throw new ApiError(200, firstError.properties.message);
    }

    const { accessToken, refreshToken } =
        await generateAccessTokenAndRefreshToken(user._id);

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken" // password and refresh token is removed before sending to frontend
    );

    if (!createdUser)
        throw new ApiError(
            200,
            "Something Went Wrong While Registering The User"
        );

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "None", // Required for cross-site cookies
    };

    return res
        .status(201)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(201, createdUser, "User Registered Successfully")
        );
});

const loginUser = asyncHandler(async function (req, res) {
    //  req.body -> data
    //  find the user by email
    //  check password
    //  generate refresh token and generate access token
    //  save refresh token in db
    //  return response after removing password and refresh token with cookie

    const { email, password } = req.body;

    if (!email || !password)
        throw new ApiError(200, "Email and Password are required");

    const user = await User.findOne({
        email,
    });

    if (!user) throw new ApiError(200, "User doesn't exist");

    const passwordExist = await user.isPasswordCorrect(password);

    if (!passwordExist) throw new ApiError(200, "Password isn't correct");

    const { accessToken, refreshToken } =
        await generateAccessTokenAndRefreshToken(user._id); // refreshToken is saved to DB inside this function only

    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    const options = {
        httpOnly: true,
        secure: true,
    };

    return res
        .status(201)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                201,
                {
                    loggedInUser,
                },
                "User Logged In Successfully"
            )
        );
});

const logoutUser = asyncHandler(async function (req, res) {
    await User.findByIdAndUpdate(
        req.user_id,
        {
            $unset: {
                refreshToken: 1,
            },
        },
        {
            new: true,
        }
    );

    const options = {
        httpOnly: true,
        secure: true,
    };

    return res
        .status(201)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(201, {}, "User Logged Out Successfully"));
});

const getCurrentUser = asyncHandler(async function (req, res) {
    return res
        .status(201)
        .json(new ApiResponse(201, req.user, "User Fetched Successfully"));
});



export {
    registerUser,
    loginUser,
    logoutUser,
    getCurrentUser,
};
