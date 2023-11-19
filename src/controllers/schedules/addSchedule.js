import response from '../../helpers/response.js';
import Schedules from '../../models/schedules.js';
import Users from '../../models/users.js';

const addSchedule = async (req, res) => {
  try {
    const { userId } = req.user;
    const { schedule, dateTime } = req.body;

    const user = await Users.findById(userId);

    if (user?.id !== userId) {
      return response({
        statusCode: 403,
        status: 'fail',
        message: 'Akses tidak diperbolehkan',
        res,
      });
    }

    if (!schedule || !dateTime) {
      return response({
        statusCode: 400,
        status: 'fail',
        message: 'Gagal menambahkan schedule. Data yang dimasukkan tidak lengkap',
        res,
      });
    }

    const today = new Date().toISOString().split('T')[0];

    const newSchedule = new Schedules({
      schedule,
      dateTime,
      finished: false,
      createdAt: today,
      userId,
    });

    const result = await newSchedule.save();

    return response({
      statusCode: 200,
      status: 'success',
      message: 'Schedule berhasil ditambahkan',
      data: {
        schedule: {
          id: result.id,
          schedule: result.schedule,
          dateTime: result.dateTime,
          finished: result.finished,
          createdAt: result.createdAt,
        },
      },
      res,
    });
  } catch (error) {
    return response({
      statusCode: 400,
      status: 'fail',
      message: error.message,
      res,
    });
  }
};

export default addSchedule;
