import * as amplitude from '@amplitude/analytics-browser';

export const initAmplitude = () => {
    amplitude.init('7037b0c2ce30e5b59fb4aa29cb722b22', {
        autocapture: false,
        includeUtm: false,
        includeReferrer: false,
        includeGclid: false,
        includeCampaign: false,
        includeSearch: false,
        includeContent: false,
        includeLocation: false,
        includeDevice: true,
        includeOs: true,
        includeBrowser: true,
        includeLanguage: true,
        includeIpAddress: false,
        includeUserAgent: false,
        includeSessionId: true,
        includeSessionStart: true,
        includeSessionEnd: true,
        includeSessionDuration: true,
    });
};

export const identifyUser = (userProfile) => {
    if (!userProfile) {
        console.warn('No user profile provided for Amplitude identification');
        return;
    }
    console.log('Identifying user in Amplitude:', userProfile);
    if (!userProfile.user_id) {
        console.warn('No user ID found in the provided profile');
        return;
    }
    const identifyObj = new amplitude.Identify();
    console.log('Profile:', userProfile);
    identifyObj.set('email', userProfile.email || '');
    //identifyObj.set('name', userProfile.name || '');
    identifyObj.set('workerId', userProfile.worker_id || '');
    //identifyObj.set('workerTypeId', userProfile.worker_type_id || '');
    identifyObj.set('workerTypeName', userProfile.worker_types?.worker_type_name || '');
    //identifyObj.set('hospitalId', userProfile.workers_hospitals?.[0]?.hospital_id || '');
    identifyObj.set('hospitalName', userProfile.workers_hospitals?.[0]?.hospitals?.name || '');
    //identifyObj.set('specialityId', userProfile.workers_specialities?.[0]?.speciality_id || '');
    identifyObj.set('specialityCategory', userProfile.workers_specialities?.[0]?.specialities?.speciality_category || '');
    identifyObj.set('specialitySubcategory', userProfile.workers_specialities?.[0]?.specialities?.speciality_subcategory || '');
  
    console.log('Identify object:', identifyObj);

    amplitude.identify(identifyObj);
    amplitude.flush(); // 💥 Envía enseguida
    
    if (userProfile.user_id) {
        amplitude.setUserId(userProfile.user_id);
    }
};

export const logEvent = (eventName, eventProperties) => {
    amplitude.track(eventName, eventProperties);
};
