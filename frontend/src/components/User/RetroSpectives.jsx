import { useState, useEffect } from "react";
import axios from "axios";
import { backendUrl } from "../../constant";

const api = axios.create({
    baseURL: `${backendUrl}/api/v1/retrospectives/`,
    withCredentials: true,
});

const RetroSpectives = () => {
    
}

export default RetroSpectives;
