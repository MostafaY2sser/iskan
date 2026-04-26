/**
 * Test to verify the correct endpoint URL construction
 */

// Test the URL construction
const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://grh.sa/api';
const userId = '25aff181-9f72-4bac-addb-c41a69505047';
const constructedURL = `${baseURL}/uploads/documents/signup/${userId}`;

console.log('🔍 Endpoint URL Test:');
console.log('Base URL:', baseURL);
console.log('User ID:', userId);
console.log('Constructed URL:', constructedURL);
console.log('Expected URL:', 'https://grh.sa/api/uploads/documents/signup/25aff181-9f72-4bac-addb-c41a69505047');

// Check if they match
const expectedURL = 'https://grh.sa/api/uploads/documents/signup/25aff181-9f72-4bac-addb-c41a69505047';
const matches = constructedURL === expectedURL;

console.log('✅ URLs match:', matches);

if (!matches) {
  console.log('❌ URL mismatch detected!');
  console.log('Expected:', expectedURL);
  console.log('Actual:', constructedURL);
} else {
  console.log('✅ Project is hitting the correct endpoint!');
}

export { constructedURL, expectedURL, matches };
