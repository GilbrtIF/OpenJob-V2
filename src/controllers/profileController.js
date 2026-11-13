
import {
  getUserById,
} from '../services/usersService.js';

import {
  getProfileApplications as findProfileApplications,
} from '../services/applicationsService.js';

import {
  getBookmarks,
} from '../services/bookmarksService.js';


// GET PROFILE

export const getProfile = async (req, res) => {
  // Mengambil user berdasarkan ID dari access token
  const user = await getUserById(req.auth.id);

  // Hanya mengembalikan informasi yang boleh dilihat client
  const {
    id,
    name,
    email,
    role,
  } = user;

  return res.status(200).json({
    status: 'success',
    data: {
      id,
      name,
      email,
      role,
    },
  });
};


// GET PROFILE APPLICATIONS

export const getProfileApplications = async (req, res) => {
  // Mengambil seluruh lamaran milik user yang login (detail, 15 properti)
  const applications = await findProfileApplications(
    req.auth.id
  );

  return res.status(200).json({
    status: 'success',
    data: {
      applications,
    },
  });
};


// GET PROFILE BOOKMARKS

export const getProfileBookmarks = async (req, res) => {
  // Mengambil seluruh bookmark milik user yang login
  const bookmarks = await getBookmarks(req.auth.id);

  return res.status(200).json({
    status: 'success',
    data: {
      bookmarks,
    },
  });
};
