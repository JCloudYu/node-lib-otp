/**
 * Project: node-lib-otp
 * File: test.js
 * Author: JCloudYu
 * Create Date: Nov. 28, 2017
 */
(() => {
	"use strict";
	
	const otp = require( './otp' );
	const base32 = require( 'thirty-two' );
	
	{
		const testTime	= 1511892429;
		const answer	= '711318';
		let result;
	
	
	
		otp.TOTPUseBN = true;
		process.stdout.write( "Testing builtin integer environment...\n" );
		process.stdout.write( "    Testing directly assigned secret... " );
		result = otp({ label:'abc', secret:base32.decode('JBSWY3DPEHPK3PXP')}).totp({
			length:6, time:testTime
		});
		process.stdout.write( `${result === answer ? "passed!" : "failed"}\n` );
		
		process.stdout.write( "    Testing otpauth uri... " );
		result = otp( 'otpauth://totp/user@host.com?secret=JBSWY3DPEHPK3PXP' ).totp({
			length:6, time:testTime
		});
		process.stdout.write( `${result === answer ? "passed!" : "failed"}\n` );
		
		
		
		
		
		
		otp.TOTPUseBN = true;
		process.stdout.write( "Testing bignumber environment...\n" );
		process.stdout.write( "    Testing directly assigned secret... " );
		result = otp({ label:'abc', secret:base32.decode('JBSWY3DPEHPK3PXP')}).totp({
			length:6, time:testTime
		});
		process.stdout.write( `${result === answer ? "passed!" : "failed"}\n` );
		
		process.stdout.write( "    Testing otpauth uri... " );
		result = otp( 'otpauth://totp/user@host.com?secret=JBSWY3DPEHPK3PXP' ).totp({
			length:6, time:testTime
		});
		process.stdout.write( `${result === answer ? "passed!" : "failed"}\n` );
	}
})();
