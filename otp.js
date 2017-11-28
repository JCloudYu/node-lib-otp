/**
 * Project: node-lib-otp
 * File: otp.js
 * Author: JCloudYu
 * Create Date: Nov. 28, 2017
 */
(()=>{
	"use strict";
	
	const crypto = require( 'crypto' );
	const base32 = require( 'thirty-two' );
	const moment = require( 'moment' );
	
	
	
	class OTPObj {
		constructor(conf) {
			let {_label='libotp', _secret='', _timeRef=0, _timeSlice=30} = {};
			Object.defineProperties(this, {
				label:{
					get: ()=>{ return _label || '' },
					set: (val)=>{ _label = `${val}`; },
					enumerable:true, configurable:false
				},
				secret:{
					get: ()=>{ return _secret; },
					set: (val)=>{
						if ( Buffer.isBuffer(val) ) {
							_secret = val;
						}
						else {
							_secret = Buffer.from(val||'', 'utf8');
						}
					},
					enumerable:true, configurable:false
				},
				timeRef:{
					get: ()=>{ return _timeRef; },
					set: (val)=>{
						_timeRef = val|0;
						if ( _timeRef < 0 ) {
							_timeRef = 0;
						}
					},
					enumerable:true, configurable:false
				},
				timeSlice:{
					get: ()=>{ return _timeSlice; },
					set: (val)=>{
						_timeSlice = val|0;
						if (_timeSlice < 1) {
							_timeSlice = 30;
						}
					},
					enumerable:true, configurable:false
				}
			});
			
			
			
			// Parse from otpURI
			if ( typeof conf === 'string' ) {
		  		let matches = /^otpauth:\/\/[t|h]otp\/([\s|\S]+?)\?secret=([\s|\S]+)$/.exec(conf);
		  		if ( !matches ) {
		  			throw "Invalid otpURI!";
		  		}
		  		
		  		conf = {
					label: matches[1],
					secret: base32.decode(matches[2])
				};
			}
			else
			if ( Object(conf) !== conf ) {
				conf = {};
			}
			
			({
				label: this.label,
				secret: this.secret,
				time_ref: this.timeRef,
				time_slice: this.timeSlice
			} = conf);
		}
		hotp(counter, length=0) {
			if ( !Buffer.isBuffer(counter) ) {
				if ( Object(counter) === counter ) {
					({counter=null, length=6} = counter);
				}
				
				counter = Buffer.from( `${counter}`, 'utf8' );
			}
			
			if ( counter.length < 8 ) {
				let loop = 8 - counter.length;
				let zeroPad = Buffer.alloc(1, 0);
				let padd = [];
				while(loop-- > 0) {
					padd.push(zeroPad);
				}
				
				padd.push(counter);
				counter = Buffer.concat(padd);
			}
			
			counter = counter.slice(0, 8);
			
			
			
			if ( length <= 0 ) { length = 6; }
			let hmac = crypto.createHmac( 'sha1', this.secret ).update( counter ).digest();
			let offset = hmac[19] & 0x0f;
			let code = ''+((hmac[offset] & 0x7f) << 24 | (hmac[offset + 1] & 0xff) << 16 | (hmac[offset + 2] & 0xff) << 8 | (hmac[offset + 3] & 0xff));
			let diff = -(code.length - length);
			
			if ( diff > 0 ) {
				let pad = '';
				while( diff-- > 0 ) pad += '0';
				return `${pad}${code}`;
			}
			else
			if ( diff === 0 ) {
				return code;
			}
			else {
				return code.slice(-length);
			}
		}
		totp(length=0, time=null){
			if ( Object(length) === length ) {
				({time=null, length=6} = length);
			}
		
		
			if ( length <= 0 ) { length = 6; }
			time = moment(time);
			if ( !time.isValid() ) {
				time = moment();
			}
			
			let buff = Buffer.alloc(4);
			buff.writeUInt32BE((time.unix()/this.timeSlice)|0);
			return this.hotp(buff, length);
		}
		hotpURI(){
			let secret = base32.encode(this.secret).toString( 'utf8' ).replace(/=/g, '');
			return `otpauth://hotp/${this.label}?secret=${encodeURIComponent(secret)}`
		}
		totpURI(){
			let secret = base32.encode(this.secret).toString( 'utf8' ).replace(/=/g, '');
			return `otpauth://totp/${this.label}?secret=${encodeURIComponent(secret)}`
		}
	}
	
	function OTP(conf) {
		return new OTPObj(conf);
	}
	
	module.exports = OTP;
})();
