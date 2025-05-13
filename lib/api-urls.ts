export const DOMAIN_NAME = "http://103.165.119.119:8484/"

// Helper function to build URLs with query parameters
export const buildUrl = (base: string, params: Record<string, string | number | boolean>) => {
  const url = new URL(base);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, String(value));
  });
  return url.toString();
};

export const API_URLS = {
  // Authentication endpoints
  LOGIN_URL: DOMAIN_NAME + "student",
  REGISTER_URL: DOMAIN_NAME + "registermahi",
  GUARD_LOGIN_URL: DOMAIN_NAME + "loginmahi",
  
  // Staff related endpoints
  GET_STAFF: (params: { pCompanyId: number, pStaffId: number, pIsLogo?: number }) => 
    buildUrl(DOMAIN_NAME + "getstaff", params),
  
  GET_WORKER2: (params: { 
    pCompanyId: number, 
    pMobileNos: string, 
    pDesignation: string, 
    pStaffId: number, 
    pStaffName?: string, 
    pIsAllStaffLocation?: number 
  }) => buildUrl(DOMAIN_NAME + "getworker2", params),
  
  GET_COMPANIES: (params: { pCompanyId: number, pStaffId: number, pIsLogo: number }) => 
    buildUrl(DOMAIN_NAME + "getcompanies", params),
  
  GET_STAFF_LOCATION_MASTER: (params: { pCompanyId: number }) => 
    buildUrl(DOMAIN_NAME + "getstafflocationmaster", params),

  // Static URLs
  SAVE_SCAN_URL: DOMAIN_NAME + "savescan",
  ADDSTAFF_URL: DOMAIN_NAME + "addstaff",
  ADD_LOCATION_URL: DOMAIN_NAME + "addlocation",
  GET_WORKER_URL: DOMAIN_NAME + "getworker",
  GET_DUTY_URL: DOMAIN_NAME + "getduty",
  GET_LOCATION_URL: DOMAIN_NAME + "getlocation",
  GET_LOCATION_BY_STAFF_URL: DOMAIN_NAME + "getlocationbystaff",
  DEL_LOCATION_URL: DOMAIN_NAME + "dellocation",
  UPDATE_LOCATION_URL: DOMAIN_NAME + "updatelocation",
  ADD_DESIGNATION_URL: DOMAIN_NAME + "adddesignation",
  GET_DESIGNATION_URL: DOMAIN_NAME + "getdesignation",
  ADD_STAFF_LOCATION_URL: DOMAIN_NAME + "addstafflocation",
  GET_STAFF_LOCATION_URL: DOMAIN_NAME + "getallstafflocation",
  DEL_DESIGNATION_URL: DOMAIN_NAME + "deldesignation",
  DEL_STAFF_LOCATION_URL: DOMAIN_NAME + "delstafflocation",
  UPDATE_STAFF_LOCATION_URL: DOMAIN_NAME + "updatestafflocation",
  UPDATE_STAFF_URL: DOMAIN_NAME + "updatestaff",
  DEL_STAFF_URL: DOMAIN_NAME + "delstaff",
  UPDATE_STAFF_ATTENDANCE_TYPE_URL: DOMAIN_NAME + "updatestaffattendancetype",
  GET_TIMESHEET_URL: DOMAIN_NAME + "gettimesheet",
  GET_ATTENDANCE_URL: DOMAIN_NAME + "getattendance",
  UPDATE_APPNAME_URL: DOMAIN_NAME + "updateappname",
  GET_STUDENT_URL: DOMAIN_NAME + "getstudent",
  GET_ATTEDANCE_TO_VERIFY: DOMAIN_NAME + "getattendancetoverify",
  UPDATE_DAY_STATUS_URL: DOMAIN_NAME + "updatedaystatus",
  GET_SALARY_URL: DOMAIN_NAME + "getsalarysheet",
  ADD_HOLIDAY_URL: DOMAIN_NAME + "addholiday",
  UPLOAD_IMAGE_URL: DOMAIN_NAME + "uploadimage",
  GET_IMAGE_URL: DOMAIN_NAME + "getimage?fileName=",
}
