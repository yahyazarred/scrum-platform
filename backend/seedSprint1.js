// seedSprint1.js
require("dotenv").config();
const mongoose = require("mongoose");

// Import your models (adjust paths if needed)
const Sprint = require("./src/models/Sprint");
const UserStory = require("./src/models/UserStory");

const MONGO_URI = process.env.MONGO_URI;

async function seedSprint1() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    const projectId = "69f6a90078b55908436ecd68";

    // Step 1 - Create Sprint
    const sprint = await Sprint.create({
      project: projectId,
      sprintNumber: 1,
      goal: "Establish authentication and basic project dashboard",
      startDate: new Date("2026-02-03T00:00:00Z"),
      endDate: new Date("2026-02-24T00:00:00Z"),
      status: "Completed",
      metrics: {
        totalPoints: 17,
        completedPoints: 17,
      },
      burndownData: [
        { date: "2026-02-03", expectedRemaining: 17.0, actualRemaining: 17 },
        { date: "2026-02-04", expectedRemaining: 16.2, actualRemaining: 17 },
        { date: "2026-02-05", expectedRemaining: 15.4, actualRemaining: 17 },
        { date: "2026-02-06", expectedRemaining: 14.6, actualRemaining: 14 },
        { date: "2026-02-07", expectedRemaining: 13.8, actualRemaining: 14 },
        { date: "2026-02-08", expectedRemaining: 13.0, actualRemaining: 14 },
        { date: "2026-02-09", expectedRemaining: 12.1, actualRemaining: 11 },
        { date: "2026-02-10", expectedRemaining: 11.3, actualRemaining: 11 },
        { date: "2026-02-11", expectedRemaining: 10.5, actualRemaining: 10 },
        { date: "2026-02-12", expectedRemaining: 9.7, actualRemaining: 10 },
        { date: "2026-02-13", expectedRemaining: 8.9, actualRemaining: 10 },
        { date: "2026-02-14", expectedRemaining: 8.1, actualRemaining: 7 },
        { date: "2026-02-15", expectedRemaining: 7.3, actualRemaining: 7 },
        { date: "2026-02-16", expectedRemaining: 6.5, actualRemaining: 7 },
        { date: "2026-02-17", expectedRemaining: 5.7, actualRemaining: 7 },
        { date: "2026-02-18", expectedRemaining: 4.9, actualRemaining: 5 },
        { date: "2026-02-19", expectedRemaining: 4.0, actualRemaining: 5 },
        { date: "2026-02-20", expectedRemaining: 3.2, actualRemaining: 5 },
        { date: "2026-02-21", expectedRemaining: 2.4, actualRemaining: 5 },
        { date: "2026-02-22", expectedRemaining: 1.6, actualRemaining: 5 },
        { date: "2026-02-23", expectedRemaining: 0.8, actualRemaining: 0 },
        { date: "2026-02-24", expectedRemaining: 0.0, actualRemaining: 0 },
      ],
    });

    console.log("Sprint created:", sprint._id);

    // Step 2 - Create User Stories linked to Sprint
    const userStories = [
      {
        title: "Register",
        description: "As a user I want to register so that I can access the application’s features",
        status: "Done",
        priority: 1,
        storyPoints: 3,
        project: projectId,
        sprint: sprint._id,
        createdAt: new Date("2026-02-03T09:00:00Z"),
        completedAt: new Date("2026-02-06T14:30:00Z"),
      },
      {
        title: "Authenticate",
        description: "As a user I want to authenticate so I can securely access my account",
        status: "Done",
        priority: 1,
        storyPoints: 3,
        project: projectId,
        sprint: sprint._id,
        createdAt: new Date("2026-02-03T09:00:00Z"),
        completedAt: new Date("2026-02-09T11:15:00Z"),
      },
      {
        title: "View profile",
        description: "As a user I want to view my profile so that I can see my account information",
        status: "Done",
        priority: 2,
        storyPoints: 1,
        project: projectId,
        sprint: sprint._id,
        createdAt: new Date("2026-02-03T09:00:00Z"),
        completedAt: new Date("2026-02-11T16:45:00Z"),
      },
      {
        title: "Join projects",
        description: "As a user I want to join existing projects so that I can participate in them",
        status: "Done",
        priority: 2,
        storyPoints: 2,
        project: projectId,
        sprint: sprint._id,
        createdAt: new Date("2026-02-03T09:00:00Z"),
        completedAt: new Date("2026-02-14T10:00:00Z"),
      },
      {
        title: "Browse my projects",
        description: "As a user I want to browse projects so that I can see and access all the projects I am part of",
        status: "Done",
        priority: 2,
        storyPoints: 1,
        project: projectId,
        sprint: sprint._id,
        createdAt: new Date("2026-02-03T09:00:00Z"),
        completedAt: new Date("2026-02-14T15:20:00Z"),
      },
      {
        title: "Update profile",
        description: "As a user I want to update my profile information so that I can keep my account details accurate and up to date",
        status: "Done",
        priority: 2,
        storyPoints: 2,
        project: projectId,
        sprint: sprint._id,
        createdAt: new Date("2026-02-03T09:00:00Z"),
        completedAt: new Date("2026-02-18T13:10:00Z"),
      },
      {
        title: "Create projects",
        description: "As a user I want to create projects so that I can assume the role of product owner within them",
        status: "Done",
        priority: 2,
        storyPoints: 5,
        project: projectId,
        sprint: sprint._id,
        createdAt: new Date("2026-02-03T09:00:00Z"),
        completedAt: new Date("2026-02-23T17:00:00Z"),
      },
    ];

    await UserStory.insertMany(userStories);

    console.log("User stories inserted successfully");

    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
}

seedSprint1();