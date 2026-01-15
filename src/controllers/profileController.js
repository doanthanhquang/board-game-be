/**
 * Profile Controller
 * Handles profile-related operations
 */

import Profile from '../models/Profile.js';
import User from '../models/User.js';
import { GameScore } from '../models/GameScore.js';
import { Game } from '../models/Game.js';
import db from '../db/connection.js';

/**
 * Get current user's profile with game statistics
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user with profile
    const userWithProfile = await Profile.getUserWithProfile(userId);

    if (!userWithProfile) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Get game statistics
    const gameStats = await GameScore.getUserBestScores(userId);
    const winRateData = await GameScore.getWinRate(userId);

    // Get all enabled games to show which ones haven't been played
    const allGames = await Game.findAllEnabled();
    const gameStatsMap = new Map(gameStats.map((stat) => [stat.game_id, stat]));

    // Combine all games with statistics
    const gamesWithStats = allGames.map((game) => {
      const stats = gameStatsMap.get(game.id);
      return {
        game_id: game.id,
        game_name: game.name,
        game_slug: game.slug,
        best_moves: stats?.best_moves || null,
        best_score: stats?.best_score || null,
        wins: stats?.wins || 0,
        has_played: !!stats,
      };
    });

    // Sanitize user data
    const sanitizedUser = User.sanitize(userWithProfile);

    // Format response
    const profileData = {
      user: {
        id: sanitizedUser.id,
        username: sanitizedUser.username,
        email: sanitizedUser.email,
        role: sanitizedUser.role,
        is_active: sanitizedUser.is_active,
        created_at: sanitizedUser.created_at,
        last_login_at: sanitizedUser.last_login_at,
      },
      profile: {
        display_name: userWithProfile.display_name || null,
        avatar_url: userWithProfile.avatar_url || null,
        bio: userWithProfile.bio || null,
        preferences: userWithProfile.preferences || null,
        updated_at: userWithProfile.profile_updated_at || null,
      },
      statistics: {
        games: gamesWithStats,
        total_games_played: winRateData.totalGames,
        total_wins: winRateData.wins,
        win_rate: winRateData.winRate,
      },
    };

    return res.status(200).json({
      success: true,
      data: profileData,
    });
  } catch (error) {
    console.error('Get profile error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while fetching profile',
    });
  }
};

/**
 * Update current user's profile
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { display_name, bio, avatar_url, preferences } = req.body;

    // Validate input
    if (display_name !== undefined && display_name !== null) {
      if (typeof display_name !== 'string' || display_name.length > 100) {
        return res.status(400).json({
          success: false,
          message: 'Display name must be a string with maximum 100 characters',
        });
      }
    }

    if (bio !== undefined && bio !== null) {
      if (typeof bio !== 'string' || bio.length > 500) {
        return res.status(400).json({
          success: false,
          message: 'Bio must be a string with maximum 500 characters',
        });
      }
    }

    if (avatar_url !== undefined && avatar_url !== null && avatar_url !== '') {
      if (typeof avatar_url !== 'string' || avatar_url.length > 500) {
        return res.status(400).json({
          success: false,
          message: 'Avatar URL must be a string with maximum 500 characters',
        });
      }

      // Basic URL validation
      try {
        const url = new URL(avatar_url);
        if (url.protocol !== 'https:' && url.protocol !== 'http:') {
          return res.status(400).json({
            success: false,
            message: 'Avatar URL must be a valid HTTP or HTTPS URL',
          });
        }
      } catch (urlError) {
        return res.status(400).json({
          success: false,
          message: 'Avatar URL must be a valid URL format',
        });
      }
    }

    // Prepare update data (only include defined fields)
    const updateData = {};
    if (display_name !== undefined) {
      updateData.display_name = display_name || null;
    }
    if (bio !== undefined) {
      updateData.bio = bio || null;
    }
    if (avatar_url !== undefined) {
      updateData.avatar_url = avatar_url || null;
    }
    if (preferences !== undefined) {
      updateData.preferences = preferences || null;
    }

    // Update or create profile
    const updatedProfile = await Profile.upsert(userId, updateData);

    // Get updated user with profile
    const userWithProfile = await Profile.getUserWithProfile(userId);
    const sanitizedUser = User.sanitize(userWithProfile);

    const profileData = {
      user: {
        id: sanitizedUser.id,
        username: sanitizedUser.username,
        email: sanitizedUser.email,
        role: sanitizedUser.role,
        is_active: sanitizedUser.is_active,
        created_at: sanitizedUser.created_at,
        last_login_at: sanitizedUser.last_login_at,
      },
      profile: {
        display_name: userWithProfile.display_name || null,
        avatar_url: userWithProfile.avatar_url || null,
        bio: userWithProfile.bio || null,
        preferences: userWithProfile.preferences || null,
        updated_at: userWithProfile.profile_updated_at || null,
      },
    };

    return res.status(200).json({
      success: true,
      data: profileData,
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while updating profile',
    });
  }
};
