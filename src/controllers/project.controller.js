import path from 'path';
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Project } from "../models/project.models.js";
import { Message } from '../models/message.models.js';
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { sendEmail } from '../utils/emailUtil.js';
import dotenv from "dotenv";

dotenv.config();

const projectListing = asyncHandler(async (req, res) => {
    const {
        projectImageOne,
        projectName,
        projectFeature,
        projectLink,
    } = req.body;

    

    const existedProject = await Project.findOne({ projectName });

    if (existedProject) {
        throw new ApiError(409, "Project already exists");
    }

    const projectImageOneLocalPath = req.files?.projectImageOne?.[0]?.path;
    

    console.log('projectImageOneLocalPath:', projectImageOneLocalPath);


    if (!projectImageOneLocalPath) {
        throw new ApiError(400, "Product image file is required");
    }

    // Normalize paths for cross-platform compatibility
    const normalizedPathOne = path.normalize(projectImageOneLocalPath);


    const projectImageOneUpload = await uploadOnCloudinary(normalizedPathOne);

    // Adjust the creation of categoryArray to match the expected structure
    const categoryArray = projectFeature.split(',').map(cat => ({ feature: cat.trim() }));

    const project = await Project.create({
        projectImageOne: projectImageOneUpload.secure_url,
        projectName,
        projectFeature: categoryArray,
        projectLink
    });

    const newProject = await Project.findById(project._id);
    if (!newProject) {
        throw new ApiError(500, "Something went wrong");
    }

    return res.status(201).json(
        new ApiResponse(200, newProject, "New project listed successfully")
    );
});



const projectAll = asyncHandler(async (req, res) => {
    const projects = await Project.find(); 
    res.json(projects);
});

const messageCreation = asyncHandler(async (req, res) => {
    const { name, email, message } = req.body;

    if (!name) {
        throw new ApiError(400, "name is required");
    }
    if (!email) {
        throw new ApiError(400, "email is required");
    }
    if (!message) {
        throw new ApiError(400, "message is required");
    }

    const newMessage = await Message.create({ name, email, message });
    const createdMessage = await Message.findById(newMessage._id);

    if (!createdMessage) {
        throw new ApiError(500, "Something went wrong");
    }

    // Prepare email options
    const mailOptions = {
        from: process.env.SMTP_USER,
        to: 'ayushhvpanchal@gmail.com', // Specify the recipient's email address here
        subject: 'New Message Received',
        text: message,
        html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>New Message Received</title>
            </head>
            <body style="font-family: Arial, sans-serif; background-color: #f0f0f0; padding: 20px;">
                <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
                    <h2 style="color: #333333;">New Message Received</h2>
                    <p style="color: #666666;">Below is the message content:</p>
                    <p style="color: #333333; font-weight: bold; padding: 10px; background-color: #f5f5f5; border-left: 5px solid #3498db;">
                        ${message}
                    </p>
                    <p style="color: #666666;">Sent by: ${name} (${email})</p>
                    <p style="color: #666666;">Thank you!</p>
                </div>
            </body>
            </html>
        `,
    };

    // Send the email
    try {
        await sendEmail(mailOptions);
        
    } catch (error) {
        console.error('Error sending email:', error);
    }

    return res.status(201).json(
        new ApiResponse(200, createdMessage, "New message listed successfully")
    );
});




const messageCreationTwo = asyncHandler(async (req, res) => {
    const { name, email, message } = req.body;

    if (!name) {
        throw new ApiError(400, "name is required");
    }
    if (!email) {
        throw new ApiError(400, "email is required");
    }
    if (!message) {
        throw new ApiError(400, "message is required");
    }

    const newMessage = await Message.create({ name, email, message });
    const createdMessage = await Message.findById(newMessage._id);

    if (!createdMessage) {
        throw new ApiError(500, "Something went wrong");
    }

    // Prepare email options
    const mailOptions = {
        from: process.env.SMTP_USER,
        to: 'aryan050403@gmail.com', // Specify the recipient's email address here
        subject: 'New Message Received',
        text: message,
        html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>New Message Received</title>
            </head>
            <body style="font-family: Arial, sans-serif; background-color: #f0f0f0; padding: 20px;">
                <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
                    <h2 style="color: #333333;">New Message Received</h2>
                    <p style="color: #666666;">Below is the message content:</p>
                    <p style="color: #333333; font-weight: bold; padding: 10px; background-color: #f5f5f5; border-left: 5px solid #3498db;">
                        ${message}
                    </p>
                    <p style="color: #666666;">Sent by: ${name} (${email})</p>
                    <p style="color: #666666;">Thank you!</p>
                </div>
            </body>
            </html>
        `,
    };

    // Send the email
    try {
        await sendEmail(mailOptions);
        
    } catch (error) {
        console.error('Error sending email:', error);
    }

    return res.status(201).json(
        new ApiResponse(200, createdMessage, "New message listed successfully")
    );
});
export { projectListing,projectAll,messageCreation,messageCreationTwo };
