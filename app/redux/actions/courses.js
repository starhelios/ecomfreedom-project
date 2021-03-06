import {
  GET_COURSES_REQUEST,
  GET_COURSE_REQUEST,
  CREATE_COURSES_REQUEST,
  DELETE_COURSES_REQUEST,
  CREATE_SECTIONS_REQUEST,
  DELETE_SECTIONS_REQUEST,
  CREATE_LECTURES_REQUEST,
  DELETE_LECTURES_REQUEST,
  GET_PRICING_PLANS_REQUEST,
  ADD_PRICING_PLAN_REQUEST,
  DELETE_PRICING_PLAN_REQUEST
} from 'constants/actionTypes';

export const getCourses = payload => ({
  type: GET_COURSES_REQUEST,
  payload
});

export const getCourse = payload => ({
  type: GET_COURSE_REQUEST,
  payload
});

export const createCourse = payload => ({
  type: CREATE_COURSES_REQUEST,
  payload
});

export const deleteCourse = payload => ({
  type: DELETE_COURSES_REQUEST,
  payload
});

export const createSection = payload => ({
  type: CREATE_SECTIONS_REQUEST,
  payload
});

export const deleteSection = payload => ({
  type: DELETE_SECTIONS_REQUEST,
  payload
});

export const createLecture = payload => ({
  type: CREATE_LECTURES_REQUEST,
  payload
});

export const deleteSLecture = payload => ({
  type: DELETE_LECTURES_REQUEST,
  payload
});

export const addPricingPlan = payload => ({
  type: ADD_PRICING_PLAN_REQUEST,
  payload
});

export const getPricingPlans = payload => ({
  type: GET_PRICING_PLANS_REQUEST,
  payload
});

export const deletePricingPlan = payload => ({
  type: DELETE_PRICING_PLAN_REQUEST,
  payload
});
