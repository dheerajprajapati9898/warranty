import AsyncStorage from "@react-native-async-storage/async-storage";


// const baseUrl = "https://warrantyuat.tyrechecks.com/TCWebApi";
const baseUrl = 'https://warrantyuat.yokohama-oht.com/TCWebAPI';

const RemoteUrls = {
    baseUrl,
    getStateUrl: `${baseUrl}/api/State/StateMaster`,
    getOldTyreCompanyUrl: `${baseUrl}/api/OldTyreCompany/OldTyreCompany`,
    getProductUrl: `${baseUrl}/api/Product/ProductWithBrand`,
    getTyreBrandUrl: `${baseUrl}/api/TyreBrand/TyreBrandMaster`,
    getOldTyreBrandUrl: `${baseUrl}/api/TyreBrand/OldTyreBrand`,
    getTyreSizeUrl: `${baseUrl}/api/TyreSize/TyreSizeMaster`,
    getVehicleMakeUrl: `${baseUrl}/api/VehicleMake/VehicleMakeMaster`,
    getVehicleModelUrl: `${baseUrl}/api/VehicleModel/VehicleModelMaster`,
    getVehicleTypeUrl: `${baseUrl}/api/VehicleType/VehicleTypeMaster`,
    getVehicleVariantUrl: `${baseUrl}/api/VehicleVariant/VehicleVariantMaster`,
    getWarrantyCountUrl: `${baseUrl}/api/Warranty/WarrantyCount`,
    getphotoCategories_ListUrl: `${baseUrl}/api/Upload/photoCategories_List`,
    getLanguageListUrl: `${baseUrl}/api/MultiLanguage/LanguageList`,
    postSearchWarrantyUrl: `${baseUrl}/api/Warranty/SearchWarranty`,
    postWarrantyRegistrationUrl: `${baseUrl}/api/Warranty/WarrantyRegistration`,
    postPincodeUrl: `${baseUrl}/api/District/DistrictMasterFromStateID`,
    postChangePasswordUrl: `${baseUrl}/api/ChangePassword/Changepassword`,
    postUploadUrl: `${baseUrl}/api/Upload/UploadImage`,
    postloginUrl: `${baseUrl}/api/Login/Login`,
    postAgencyFeatureUrl: `${baseUrl}/api/AgencyFeature/AgencyFeatures`,
    postWarrantyImageMissingListUrl: `${baseUrl}/api/Warranty/WarrantyImageMissingList`,
    postMultiLanguageUrl: `${baseUrl}/api/MultiLanguage/Language`,
    postLoginWithOTPUrl: `${baseUrl}/api/Service/LoginWithOTP`,
    postLoginOTPVerificationUrl: `${baseUrl}/api/Service/LoginOTPVerification`,
    postFinalStatusUpdateUel: `${baseUrl}/api/Warranty/FinalStatusUpdate`,
    postSave_Log: `${baseUrl}/api/Service/Save_Logs`,
};

export default RemoteUrls;