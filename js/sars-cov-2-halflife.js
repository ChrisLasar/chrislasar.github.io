// Source: https://www.dhs.gov/science-and-technology/sars-airborne-calculator

var sc2hl = function(){
    var half_life_params = {
        solar_const: 0.000281,
        solar_scaler: 5.4,
        
        temp_rc_const: 20.54,
        temp_rc_scaler: 10.66,
        rh_rc_const: 45.235,
        rh_rc_scaler: 28.665,
        solar_rc_const: 50,
        solar_rc_scaler: 50,
        
        intercept: -7.679348,
        temp_coef: -1.338432,
        rh_coef: -0.017835,
        solar_coef: -7.666331,
        temp_solar_coef: -1.323633,
        temp_rh_coef: 0,
        rh_solar_coef: 0,
        temp_rh_solar_coef: 0,
        
        convert_to_time_numerator: -0.693
    };
    
    var update_covid_half_life = function (temp, rh, uv_index) {
        var params = half_life_params;
        
        var solar = (uv_index + params["solar_const"]) / params["solar_scaler"];
        
        var temp_rc = (temp - params["temp_rc_const"]) / params["temp_rc_scaler"];
        var rh_rc = (rh - params["rh_rc_const"]) / params["rh_rc_scaler"];
        var solar_rc = (solar - params["solar_rc_const"]) / params["solar_rc_scaler"];
        
        var intercept_factor = params["intercept"];
        var temp_factor = params["temp_coef"] * temp_rc;
        var rh_factor = params["rh_coef"] * rh_rc;
        var solar_factor = params["solar_coef"] * solar_rc;
        var temp_rh_factor = params["temp_rh_coef"] * temp_rc * rh_rc;
        var temp_solar_factor = params["temp_solar_coef"] * temp_rc * solar_rc;
        var rh_solar_factor = params["rh_solar_coef"] * rh_rc * solar_rc;
        var temp_rh_solar_factor = params["temp_rh_solar_coef"] * temp_rc * rh_rc * solar_rc;
        
        var k_min_denom = intercept_factor + temp_factor + rh_factor + solar_factor + temp_rh_factor + temp_solar_factor + rh_solar_factor + temp_rh_solar_factor;
        
        var half_life = params["convert_to_time_numerator"]/k_min_denom;
        
        covid_half_life_minutes.innerHTML = half_life.toFixed(2);
        // covid_half_life_hours.innerHTML = (half_life/60).toFixed(2);
        
        covid_90 = (half_life * logWithBase((1- .90), .5));
        // covid_90_minutes.innerHTML = covid_90.toFixed(2);
        // covid_90_hours.innerHTML = (covid_90/60).toFixed(2);
        
        covid_99 = (half_life * logWithBase((1- .99), .5));
        // covid_99_minutes.innerHTML = covid_99.toFixed(2);
        // covid_99_hours.innerHTML = (covid_99/60).toFixed(2);
        
        return {
            "covid_50": half_life,
            "covid_90": covid_90,
            "covid_99": covid_99
        }
    }
    
    var logWithBase = function(x, base) {
        return Math.log(x) / Math.log(base);
    } 
    
    return {
        param: half_life_params,
        fun: update_covid_half_life,
    }
}();