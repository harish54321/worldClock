var apikey = "AIzaSyAKuipdbHdUBDNXH2bIoUycBfjmaRnDEv0"
var daysofweek = ['Sun', 'Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun']
var clock_timer = null;
var pickedCard = null;

function currentlocaltime(divid, loc, place){
    var container = document.getElementById(divid)
    var targetDate = new Date() // Current date/time of user computer
    var timestamp = targetDate.getTime()/1000 + targetDate.getTimezoneOffset() * 60 // Current UTC date/time expressed as seconds since midnight, January 1, 1970 UTC
    var apicall = 'https://maps.googleapis.com/maps/api/timezone/json?location=' + loc + '&timestamp=' + timestamp + '&key=' + apikey

    var xhr = new XMLHttpRequest()
    xhr.open('GET', apicall)
    xhr.onload = function(){
        if (xhr.status === 200){
            var output = JSON.parse(xhr.responseText)
            if (output.status == 'OK'){
                var offsets = output.dstOffset * 1000 + output.rawOffset * 1000
                var localdate = new Date(timestamp * 1000 + offsets)
                var refreshDate = new Date()
                var millisecondselapsed = refreshDate - targetDate
                localdate.setMilliseconds(localdate.getMilliseconds()+ millisecondselapsed)
                if(output.dstOffset > 0){
                  $(container).find('.dst .button a').text(secondsToHms(output.dstOffset))
                  $(container).find('.dst').show()
                }
                clock_timer = setInterval(function(){
                    localdate.setSeconds(localdate.getSeconds()+1)
                    updateClockCard(container, place, localdate, output.dstOffset)
                    setclock(divid, localdate.getHours() + (localdate.getMinutes() / 60), 'hrfield')
                    setclock(divid, localdate.getMinutes(), 'minfield')
                    setclock(divid, localdate.getSeconds(), 'secfield')
                }, 1000)
            }
        }
        else{
            alert('Request failed.  Returned status of ' + xhr.status)
        }
    }
    xhr.send()
}

var updateClockCard = function(container, place, time, dst){
  var formatted_time = time.toLocaleTimeString('en-US') + " (" + daysofweek[ time.getDay() ] + ")"
  $(container).find('.header').text(place)
  $(container).find('.description').text(formatted_time)
}

var setclock = function(cardId, fieldval, fieldtype){
  var $hands = $('#' + cardId +' .staticclock div.hand') // reference all the hand DIVs

  if (fieldtype == 'hrfield'){ //fieldval should be 0-23
    var hour_as_degree = fieldval / 12 * 360 //express hours in degs
    $hands.filter('.hour').css({transform: 'rotate(' + hour_as_degree + 'deg)' }) //rotate hour DIV x degrees
  }
  else if (fieldtype == 'minfield'){ //fieldval should be 0-59
    var minute_as_degree = fieldval / 60 * 360 // same deal in mins
    $hands.filter('.minute').css({transform: 'rotate(' + minute_as_degree + 'deg)' })
  }
  else if (fieldtype == 'secfield'){ //fieldval should be 0-59
    var second_as_degree = fieldval /60 * 360
    $hands.filter('.second').css({transform: 'rotate(' + second_as_degree + 'deg)' })
  }
}

var secondsToHms = function(d){
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);

    // var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
    // var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
    // var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
    // return hDisplay + mDisplay + sDisplay;
    return h +':'+ s
}

var showPopupClock = function(place){
  currentlocaltime('popupClock', place.geometry.location.lat() + ', ' + place.geometry.location.lng(), place.formatted_address)
  $('.ui.modal#popupClock').modal({
      inverted  : true,
      closable  : false,
      onDeny    : function(){
        // window.alert('angane parayalle muthe');
        // return false;
      },
      onApprove : function() {
        // window.alert('Approved!');
        var data = {
          clock: {
            place_id: place.place_id,
            name: place.name,
            formatted_name: place.formatted_address,
            lat: place.geometry.location.lat(),
            lon: place.geometry.location.lng(),
            map_url: place.url
          }
        }

        $.ajax({
          type: "POST",
          url: '/clock/create',
          data: data,
          success: function(res){
            console.log(res)
            window.location.reload()
          }
        })
      },
      onHidden: function(){
        clearTimeout(clock_timer)
        $("#popupClock").find('.header').html('<i class="spinner icon spin"></i>')
        $("#popupClock").find('.description').html('<i class="spinner icon spin"></i>')
        setclock('popupClock', 0, 'hrfield')
        setclock('popupClock', 0, 'minfield')
        setclock('popupClock', 0, 'secfield')
      }
  }).modal('show')
}

var deleteClock = function(clock_id){
  $('.ui.basic.modal.delete').modal({
      onApprove : function() {
        var data = {
          clock: {
            place_id: clock_id,
          }
        }
        $.ajax({
          type: "DELETE",
          url: '/clock/delete/' + clock_id,
          data: data,
          success: function(res){
            console.log(res)
            window.location.reload()
          }
        })
      }
    }).modal('show')
  }


