import {
  addUser,
  getUserById as findUserById,
} from '../services/usersService.js';

import {
  get as getCache,
  set as setCache,
} from '../services/cacheService.js';

// POST /users
export const postUser = async (req, res) => {
  const id = await addUser(req.body);

  return res.status(201).json({
    status: 'success',
    data: {
      id,
    },
  });
};

// GET /users/:id
export const getUserById = async (req, res) => {
  const cacheKey = `users:${req.params.id}`;

  const cachedResponse = await getCache(cacheKey);

  if (cachedResponse !== null) {
    return res
      .set('X-Data-Source', 'cache')
      .status(200)
      .json(cachedResponse);
  }

  const user = await findUserById(req.params.id);

  const responseBody = {
    status: 'success',
    data: user,
  };

  await setCache(cacheKey, responseBody);

  return res
    .set('X-Data-Source', 'database')
    .status(200)
    .json(responseBody);
};