/**
 * This file will export nothing. 
 * But call this file addition function will be added to Javascript core objects
 */
(()=>{
    // Array.prototype.nestedJoin = function(jstr) {
    //     var retVal = "";
    //     jstr = jstr || ",";

    //     for(var i=0; i < this.length; i++) {
    //         if(Array.isArray(this[i])) {
    //             var val = Array.prototype.nestedJoin.apply(this[i], [jstr]);
    //             if("" !== val.trim()) {
    //                 retVal += val + jstr;
    //             }
    //         } else if("" !== this[i].trim()){
    //             retVal += this[i] + jstr;
    //         }
    //     }
        
    //     return String.prototype.slice.call(
    //         retVal,
    //         0,  (-jstr.length)
    //     );
    // }
    Date.prototype.format = () => {
        ;
    }
})();