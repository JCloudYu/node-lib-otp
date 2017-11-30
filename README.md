OTP module for nodejs
=====================
Well, as what you can expect! This is a another module providing OTP function for developers.
I do it because I recently encounter a very stupid problem from other modules. And that module's latest modification date was 3~4 years ago. So I gave up and write a new one on my own. This module is "TEMPORARILY" designed for nodejs only 'cuase that's what I needed it for.



## Requirement ##
- NodeJS >= 6.4 ( with es6 syntax support... )



## Installation ##
```shell
npm install lib-otp
```



## Usage ##

```javascript=1
const otp = require( 'lib-otp' );

let otpFromURI = otp( 'otpauth://totp/....' ); // Create an otp object by parsing an otpauth URI


let otpObj = otp({
	secret:'secret',		// The secret of this otp instance, either Buffer or String is accepted, used in otp generation
	label: '_label'		// The label of this otp instance, the string that is used in generating an otpauth URI
});

// Obtain TOTP
otpObj.totp(6);			// Obtain an otp code with 6 digits
otpObj.totp({			// Obtain an otp code at specific moment with 8 digits
	time:((new Date()).getTime()/1000)|0, 
	length:8
});

// Obtain HOTP
otpObj.hotp(13, 6);		// Obtain an hotp code of counter value 13 with 6 digits
otpObj.hotp({			// Alternative accepted usage
	counter:13,			// counter value, can be either Buffer or Number, other types will be casted into string and converted into buffer
	length:6
});

otpObj.totpURI();		// otpauth://totp/_label?secret=Base32EncodedSecret
otpObj.hotpURI();		// otpauth://hotp/_label?secret=Base32EncodedSecret
```



## Note ##
By default, this module will handle numeric values via BN.js library. But developers can choose to use bitwise operator to cast given numeric values into normal integers.

```javascript=1
OTP.TOTPUseBN = false;	// This value is true by default
```

But javascript current only natively support 32bit integers, using it will cause unexpected data loss if the given number's range is larger than 32bits.

So... use at your own risk...
