import {
  addBookmark,
  getBookmarks,
  getBookmarkById as findBookmarkById,
  deleteBookmark as removeBookmark,
} from '../services/bookmarksService.js';

import {
  get as getCache,
  set as setCache,
  del as deleteCache,
} from '../services/cacheService.js';

// POST BOOKMARK
export const postBookmark = async (req, res) => {
  const id = await addBookmark(
    req.params.jobId,
    req.auth.id
  );

  // Invalidasi setelah INSERT berhasil.
  await deleteCache(`bookmarks:user:${req.auth.id}`);

  return res.status(201).json({
    status: 'success',
    data: {
      id,
    },
  });
};

// GET ALL BOOKMARKS
export const getAllBookmarks = async (req, res) => {
  const cacheKey = `bookmarks:user:${req.auth.id}`;

  const cachedResponse = await getCache(cacheKey);

  if (cachedResponse !== null) {
    return res
      .set('X-Data-Source', 'cache')
      .status(200)
      .json(cachedResponse);
  }

  const bookmarks = await getBookmarks(req.auth.id);

  const responseBody = {
    status: 'success',
    data: {
      bookmarks,
    },
  };

  await setCache(cacheKey, responseBody);

  return res
    .set('X-Data-Source', 'database')
    .status(200)
    .json(responseBody);
};

// GET BOOKMARK BY ID
export const getBookmarkById = async (req, res) => {
  const bookmark = await findBookmarkById(
    req.params.jobId,
    req.params.id,
    req.auth.id
  );

  return res.status(200).json({
    status: 'success',
    data: bookmark,
  });
};

// DELETE BOOKMARK
export const deleteBookmark = async (req, res) => {
  await removeBookmark(
    req.params.jobId,
    req.auth.id
  );

  // Invalidasi setelah DELETE berhasil.
  await deleteCache(`bookmarks:user:${req.auth.id}`);

  return res.status(200).json({
    status: 'success',
    message: 'Bookmark berhasil dihapus',
  });
};