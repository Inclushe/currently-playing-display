exports.callbackSuccess = {
  'access_token': 'mock_success',
  'token_type': 'Bearer',
  'expires_in': 3600,
  'scope': 'user-read-currently-playing',
  'refresh_token': 'mock_reset'
}

exports.callbackFailure = {
  'error': 'mock_error',
  'error_description': 'Mocking error'
}

exports.refreshSuccess = {
  'access_token': 'mock_success',
  'token_type': 'Bearer',
  'expires_in': 3600,
  'scope': 'user-read-currently-playing'
}

exports.refreshFailure = {
  'error': 'mock_error',
  'error_description': 'Mocking error'
}

exports.codeNotFound = {
  'error': 'code_not_found',
  'error_description': 'Mocking error'
}
