export default class chefcookie
{

    constructor(config)
    {
        this.config = config;
        this.test();
    }

    test()
    {
        console.log(this.config);
    }

}

window.chefcookie = chefcookie;