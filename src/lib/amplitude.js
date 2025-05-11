import * as amplitude from '@amplitude/analytics-browser';

const AMPLITUDE_ENABLED = Boolean(process.env.REACT_APP_AMPLITUDE_API_KEY);

class AmplitudeService {
    static init() {
        if (!AMPLITUDE_ENABLED) {
            console.info('[Amplitude] Deshabilitado');
            return;
        }

        console.info(`[Amplitude] ENV: ${process.env.REACT_APP_ENV}`);
        amplitude.init(process.env.REACT_APP_AMPLITUDE_API_KEY, {
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
    }

    static identify(userProfile) {
        if (!AMPLITUDE_ENABLED || !userProfile?.user_id) return;

        const identifyObj = new amplitude.Identify();
        identifyObj.set('email', userProfile.email || '');
        identifyObj.set('workerId', userProfile.worker_id || '');
        identifyObj.set('workerTypeName', userProfile.worker_types?.worker_type_name || '');
        identifyObj.set('hospitalName', userProfile.workers_hospitals?.[0]?.hospitals?.name || '');
        identifyObj.set('specialityCategory', userProfile.workers_specialities?.[0]?.specialities?.speciality_category || '');

        amplitude.setUserId(userProfile.user_id);
        amplitude.identify(identifyObj);
        amplitude.flush();
    }

    static track(eventName, eventProperties = {}) {
        if (!AMPLITUDE_ENABLED) {
            console.info(`[Amplitude - ${process.env.REACT_APP_ENV}] ${eventName}`, eventProperties);
            return;
        }

        amplitude.track(eventName, eventProperties);
    }

    static flush() {
        if (AMPLITUDE_ENABLED) amplitude.flush();
    }
    static reset() {
        if (AMPLITUDE_ENABLED) {
            amplitude.reset(); // limpia userId y propiedades
            console.info('[Amplitude] Reset completo');
        }
    }

}

export default AmplitudeService;
