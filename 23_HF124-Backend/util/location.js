const axios = require('axios');  // 'axios' 라이브러리를 가져옵니다. HTTP 요청을 보내는데 사용됩니다.

const HttpError = require('../models/http-error'); // HttpError 모델을 가져옵니다. 에러 핸들링에 사용됩니다.

const API_KEY = 'AIzaSyDgLmMpKCzveJf1_yuA0fUzzhy0WRChvZA'; // Google Maps Geocoding API의 API 키입니다.

async function getCoordsForAddress(address) {
  // 주소를 받아서 해당 주소의 좌표(위도와 경도)를 반환하는 비동기 함수입니다.

  const response = await axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${API_KEY}`
  ); // axios를 사용해 Google Maps Geocoding API에 GET 요청을 보냅니다.

  const data = response.data; // 응답 데이터를 저장합니다.

  if (!data || data.status === 'ZERO_RESULTS') {
    // 데이터가 없거나 status가 'ZERO_RESULTS'(즉, 해당 주소의 결과가 없음)인 경우 에러를 생성하고 던집니다.

    const error = new HttpError(
      'Could not find location for the specified address.',
      422
    );
    throw error;
  }

  const coordinates = data.results[0].geometry.location; // 응답 데이터에서 첫 번째 결과의 지리적 위치(위도와 경도)를 가져옵니다.

  return coordinates; // 위도와 경도를 반환합니다.
}

module.exports = getCoordsForAddress; // 이 함수를 다른 파일에서 가져와 사용할 수 있도록 내보냅니다.
