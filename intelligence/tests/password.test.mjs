import test from 'node:test';
import assert from 'node:assert/strict';
import {webcrypto} from 'node:crypto';
import {generateStrongPassword} from '../src/password.js';

test('gera senha aleatória com força adequada para Supabase',()=>{
 const pwd=generateStrongPassword(webcrypto);
 assert.equal(pwd.length,28);
 assert.match(pwd,/[A-Z]/);
 assert.match(pwd,/[a-z]/);
 assert.match(pwd,/[0-9]/);
 assert.match(pwd,/[-_]/);
 assert.match(pwd,/^[A-Za-z0-9_-]+$/);
});
test('as senhas mudam a cada geração',()=>{
 const arr=Array.from({length:10},()=>generateStrongPassword(webcrypto));
 assert.equal(new Set(arr).size,arr.length);
});
test('recusa fontes sem aleatoriedade criptográfica',()=>{
 assert.throws(()=>generateStrongPassword({}),/Gerador seguro indisponível/);
 assert.throws(()=>generateStrongPassword(webcrypto,5),/Comprimento/);
});
