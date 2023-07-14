module.exports = function(err, req, res, next) {
    // 에러 처리 로직을 작성합니다.
    // 예를 들어, err 객체의 정보를 확인하고 적절한 HTTP 상태 코드와 에러 메시지를 응답으로 반환합니다.

    res.status(500).send('Something went wrong!');
};
