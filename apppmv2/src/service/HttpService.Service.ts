import axios from 'axios';
import { useNetInfo } from '@react-native-community/netinfo'
import { dataProfile } from '../global/assets/service/Function.Service';

// Add a request interceptor
axios.interceptors.request.use(
    function (config) {
        return config;
    },
    function (error) {
        return Promise.reject(error);
    },
);

// Add a response interceptor
axios.interceptors.response.use(
    function (response: any) {
        if (response?.status === 200) {
            return response?.data;
        } else if (response && response !== "") {
            return response;
        } else {
            return null;
        }
    },
    function (error) {
        return Promise.reject(error);
    },
);

export const handleCheckInternet = (): boolean => {
    // const netInfo = useNetInfo();
    return true; //(netInfo.isConnected && netInfo.isInternetReachable) ? true : false;
}

export default class HttpService {
    static generateHeader = (headers?: any, newToken?: any) => {        
        let originHeader: any = {
            "Accept": 'application/json',
            'Content-Type': 'application/json',
            'Application-Request': '',
            'IsApp': true,
            'page': 1,
            'pageSize': 20,
            'sort': true,
            'typeSort': 'ASC',
        };

        if(dataProfile.data?.accessToken) {
            originHeader = {
                ...originHeader,
                Authorization: `Bearer ${dataProfile.data?.accessToken}`,
            }
        }

        if(dataProfile.data?.id) {
            originHeader = {
                ...originHeader,
                profileid: dataProfile.data?.id,
            }
        }

        return { ...originHeader, ...headers };
    }

    static async Get(url: string, header?: any): Promise<unknown> {
        return new Promise((resolve, reject) => {
            if (handleCheckInternet() === true) {
                axios
                    .get(url, {
                        headers: this.generateHeader(header, null),
                    })
                    .then(res => resolve(res))
                    .catch(error => {
                        if (handleCheckInternet() === false) {
                            // Không có internet
                            reject('E_NOINTERNET');
                        }
                        else {
                            console.log(error, 'error');

                            if (error.response) {
                                console.log(error.response.status, url);
                            } else if (error.request) {
                                console.log(error.request);
                            } else {
                                // Something happened in setting up the request that triggered an Error
                                console.log('Error', error.message);
                            }
                            reject(error);
                        }
                    });
            } else {
                reject('E_NOINTERNET');
            }
        });
    }
    static async Post(url: string, body?: any, header?: any): Promise<unknown> {
        return new Promise((resolve, reject) => {
            if (handleCheckInternet() === true) {
                // console.log(
                //     JSON.stringify({
                //         url: url,
                //         body: body,
                //         header: this.generateHeader(header, null),
                //     })
                // );
                
                axios
                    .post(url, body, {
                        headers: this.generateHeader(header, null),
                    })
                    .then(res => resolve(res.data))
                    .catch(error => {
                        if (handleCheckInternet() === false) {
                            // Không có internet
                            reject("E_NOINTERNET");
                        }
                        else {
                            if (error.response) {
                                console.log(error.response.status, url);
                            } else if (error.request) {
                                console.log(error.request);
                            } else {
                                // Something happened in setting up the request that triggered an Error
                                console.log('Error', error.message);
                            }
                            reject(error);
                        }
                    });
            } else {
                // Không có internet
                reject("E_NOINTERNET");
            }
        });
    }
    static MultiRequest(listRequest: []): Promise<unknown> {
        return new Promise((resolve, reject) => {
            if (handleCheckInternet() === true) {
                axios
                    .all(listRequest)
                    .then(
                        axios.spread(function () {
                            resolve([].slice.call(arguments));
                        })
                    )
                    .catch(error => {
                        if (handleCheckInternet() === false) {
                            // Không có internet
                            reject("E_NOINTERNET");
                        }
                        else {
                            if (error.response) {
                                console.log(error.response);
                            } else if (error.request) {
                                console.log(error.request);
                            } else {
                                // Something happened in setting up the request that triggered an Error
                                console.log('Error', error.message);
                            }
                        }
                    });
            } else {
                reject('E_NOINTERNET');
            }
        });
    }
}