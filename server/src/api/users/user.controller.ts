import { Request, Response } from "express";
import { userService } from "./user.service";
import { ApiResponse } from "../../types/api";
import { asyncHandler } from "../../middlewares/error.middleware";
import { AuthenticationError, NotFoundError } from "../../middlewares/error.middleware";
import { SUCCESS_MESSAGES } from "../../constants/errors";

export class UserController {
  // Get all users (Admin only)
  listUsers = asyncHandler(async (req: Request, res: Response) => {
    const { users, pagination } = await userService.listUsers(req.query);

    const response: ApiResponse = {
      success: true,
      data: { users, pagination },
    };

    res.json(response);
  });

  // Get user by ID (Self, assigned mentor, or admin)
  getUserById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = await userService.getUserById(id);

    const response: ApiResponse = {
      success: true,
      data: { user },
    };

    res.json(response);
  });

  // Update user profile (Self or admin)
  updateProfile = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = await userService.updateProfile(id, req.body);

    const response: ApiResponse = {
      success: true,
      data: { user },
      message: SUCCESS_MESSAGES.PROFILE_UPDATED,
    };

    res.json(response);
  });

  // Deactivate user (Admin only)
  deactivateUser = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    await userService.deactivateUser(id);

    const response: ApiResponse = {
      success: true,
      message: "User deactivated successfully",
    };

    res.json(response);
  });

  // Activate user (Admin only)
  activateUser = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    await userService.activateUser(id);

    const response: ApiResponse = {
      success: true,
      message: "User activated successfully",
    };

    res.json(response);
  });

  // Get user's assigned mentors (Student or admin)
  getUserMentors = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const mentors = await userService.getUserMentors(id);

    const response: ApiResponse = {
      success: true,
      data: { mentors },
    };

    res.json(response);
  });

  // Get mentor's assigned students (Mentor or admin)
  getMentorStudents = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const students = await userService.getMentorStudents(id);

    const response: ApiResponse = {
      success: true,
      data: { students },
    };

    res.json(response);
  });

  // Assign mentor to student (Admin only)
  assignMentor = asyncHandler(async (req: Request, res: Response) => {
    const assignment = await userService.assignMentor(req.body);

    const response: ApiResponse = {
      success: true,
      data: { assignment },
      message: SUCCESS_MESSAGES.MENTOR_ASSIGNED,
    };

    res.status(201).json(response);
  });

  // Unassign mentor from student (Admin only)
  unassignMentor = asyncHandler(async (req: Request, res: Response) => {
    await userService.unassignMentor(req.body);

    const response: ApiResponse = {
      success: true,
      message: SUCCESS_MESSAGES.MENTOR_UNASSIGNED,
    };

    res.json(response);
  });
}

export const userController = new UserController();