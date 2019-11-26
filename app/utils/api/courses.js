import axios from 'axios';
import { API_ENDPOINT_URL } from 'constants/default';

// Courses
export const getCourses = payload => {
  const params = payload && payload.params;
  console.log('getCourses', params);
  return axios
    .get(`${API_ENDPOINT_URL}/course`, { params })
    .then(res => {
      if (res.data) {
        return { success: true, data: res.data };
      }
      return { success: false, reason: res.message };
    })
    .catch(err => ({ success: false, reason: err.response.data.message }));
};

export const getCourse = payload => {
  console.log('getCourse', payload);
  const id = payload && payload.id;
  return axios
    .get(`${API_ENDPOINT_URL}/course/${id}`)
    .then(res => {
      if (res.data) {
        return { success: true, data: res.data };
      }
      return { success: false, reason: res.message };
    })
    .catch(err => ({ success: false, reason: err.response.data.message }));
};

export const createCourses = payload => {
  const data = {
    title: payload.title,
    subtitle: payload.subtitle,
    authors: payload.authors
  };

  if (payload.id) {
    data.id = payload.id;
  }

  return axios
    .post(`${API_ENDPOINT_URL}/course`, data)
    .then(res => {
      console.log('createCourses res', res);
      if (res.data) {
        return { success: true, data: res.data };
      }
      return { success: false, reason: res.message };
    })
    .catch(err => ({ success: false, reason: err.response.data.message }));
};

export const deleteCourses = payload =>
  axios
    .delete(`${API_ENDPOINT_URL}/course/${payload.name}`)
    .then(res => {
      if (res.data) {
        return { success: true };
      }
      return { success: false, reason: res.message };
    })
    .catch(err => ({ success: false, reason: err.response.data.message }));

export const createSection = payload => {
  const data = {
    title: payload.title,
    id: payload.id
  };

  const courseId = payload.courseId;

  return axios
    .post(`${API_ENDPOINT_URL}/course/${courseId}/section`, data)
    .then(res => {
      console.log('createSection res', res);
      if (res.data) {
        return { success: true, data: res.data };
      }
      return { success: false, reason: res.message };
    })
    .catch(err => ({ success: false, reason: err.response.data.message }));
};
