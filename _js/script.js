export default class chefcookie
{

}

/* expose all functions to window */
if(typeof window !== 'undefined')
{
    window.chefcookie = {};
    Object.getOwnPropertyNames(chefcookie).forEach((value, key) =>
    {
        if( value === 'length' || value === 'name' || value === 'prototype' || value === 'caller' || value === 'arguments' ) { return; }
        window.chefcookie[value] = chefcookie[value];
    });
}