function escapeNoneAscii($str) 
{
  var transTable = [], utf8reg = '/[\xC0-\xDF][\x80-\xBF]|[\xE0-\xEF][\x80-\xBF][\x80-\xBF]/';

  if(escapeURIComponent(str.match(utf8reg))) {
    return str;
  }
  
  foreach($matches[0] as $utf8char) {
    if(isset($transTable[$utf8char])) {
      continue;
    }
    
    switch(strlen($utf8char)) {
    case 2:
      $code = (
       ((ord($utf8char{0}) & 0x1F) << 6) |
        (ord($utf8char{1}) & 0x3F)
      );
      break;

    case 3:
      $code = (
       ((ord($utf8char{0}) & 0x0F) << 12) |
       ((ord($utf8char{1}) & 0x3F) << 6 ) |
        (ord($utf8char{2}) & 0x3F)
      );
      break;
    default:
    }
    $transTable[$utf8char] = '\u'. substr('0000'. dechex($code), -4);
  }
  return strtr($str, $transTable);
}