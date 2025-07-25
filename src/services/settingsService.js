// src/services/settingsService.js

// Dữ liệu cài đặt giả lập ban đầu
let generalSettings = {
    appName: 'Học Tiếng Nhật Online',
    appDescription: 'Nền tảng học tiếng Nhật toàn diện cho mọi cấp độ.',
    appLogoUrl: 'https://via.placeholder.com/100x50?text=Logo', // URL logo giả định
    language: 'vi', // 'vi' for Vietnamese, 'en' for English
    theme: 'light', // 'light' or 'dark'
    enableNotifications: true,
    autoSave: false, // Ví dụ: tùy chọn tự động lưu
    defaultItemsPerPage: 10,
};

/**
 * Lấy tất cả cài đặt chung.
 * @returns {Promise<Object>} Một promise trả về đối tượng cài đặt.
 */
export function getGeneralSettings() {
    return Promise.resolve({ ...generalSettings }); // Trả về bản sao để tránh thay đổi trực tiếp
}

/**
 * Cập nhật cài đặt chung.
 * @param {Object} newSettings Đối tượng chứa các cài đặt cần cập nhật.
 * @returns {Promise<Object>} Một promise trả về đối tượng cài đặt đã cập nhật.
 */
export function updateGeneralSettings(newSettings) {
    // Chỉ cập nhật các trường được cung cấp
    generalSettings = { ...generalSettings, ...newSettings };
    console.log('Settings updated:', generalSettings);
    return Promise.resolve({ ...generalSettings }); // Trả về bản sao đã cập nhật
}

/**
 * Reset cài đặt về trạng thái mặc định.
 * @returns {Promise<Object>} Một promise trả về đối tượng cài đặt mặc định.
 */
export function resetGeneralSettings() {
    generalSettings = {
        appName: 'Học Tiếng Nhật Online',
        appDescription: 'Nền tảng học tiếng Nhật toàn diện cho mọi cấp độ.',
        appLogoUrl: 'https://via.placeholder.com/100x50?text=Logo',
        language: 'vi',
        theme: 'light',
        enableNotifications: true,
        autoSave: false,
        defaultItemsPerPage: 10,
    };
    console.log('Settings reset to default:', generalSettings);
    return Promise.resolve({ ...generalSettings });
}