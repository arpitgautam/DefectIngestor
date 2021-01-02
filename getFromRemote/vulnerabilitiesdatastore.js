

/**
 * Object of this will contain Set of all the vulnerabilities 
 */
class VulnerabilitiesDataStore{

    constructor(){
        this._container = new Array();
        this._title = '';

    }

    get title(){
        return this._title;
    }

    set title(t){
        this._title = t;
    }

    get container(){
        return this._container;
    }
    
    add(product, desc,cvss,number)
    {
        let dataItem = new DataItem(product,desc,cvss,number);
        this._container.push(dataItem);
    }

    size(){
        return this._container.size;
    }

    filter(fn){
        this._container.filter(fn);
    }
    forEach(fn){
        this._container.forEach(fn);
    }
}

class DataItem{
    constructor(p,d,c,n){
        this._product=p;
        this._desc = d;
        this._cvss = c;
        this._number = n;
        this._processed = false;
    }

    get product(){
        return this._product;
    }

    set product(p){
        this._product = p;
    }

    get description(){
        return this._desc;
    }

    set description(d){
        this._desc = d;
    }

    get cvss(){
        return this._cvss;
    }

    set cvss(c){
        this._cvss = c;
    }

    get number(){
        return this._number;
    }

    set number(n){
        this._number = n;
    }

    adaptForDB(){
        return {
            'Cvss': this._cvss,
            'Description': this._desc,
            'Number': this._number,
            'Product': this._product
        };
    }

}

module.exports =  VulnerabilitiesDataStore;