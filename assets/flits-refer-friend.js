
if (!window.flitsApp || typeof window.flitsApp == "undefined") {
  window.flitsApp = {};
}

if (!window.flitsApp.refer_friend || typeof window.flitsApp.refer_friend == "undefined") {
  window.flitsApp.refer_friend = {};
}

window.flitsApp.getURLParameter = function (name) {
  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null;
};

window.flitsApp.closeReferralModal = function () {

  document.querySelector('#flits-referral-modal').style.display = "none";
  return document.querySelector('#flits-referral-modal');
};

window.flitsApp.openReferralModal = function () {
  window.flitsApp.setCookie('flits-referral-popup-closed','1',1);
  document.querySelector('#flits-referral-modal').style.display = "block";
  return document.querySelector('#flits-referral-modal');
};
window.flitsApp.addContentReferralModal = function (content) {
  document.querySelector('#flits-referral-modal .flits-referral-content .flits-content').innerHTML = content;
  return document.querySelector('#flits-referral-modal');
};


window.flitsApp.getCookie = function (cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
};

window.flitsApp.setCookie = function (cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  var expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
};

window.flitsApp.isNull = function (x) {
  return (typeof x == "undefined" || x == null || x.trim() == "");
};

window.flitsApp.run_after_jquery = function (callback) {
  var callback_interval = setInterval(function () {
    if (typeof flitsAppJquery == "undefined") {

    } else {
      clearInterval(callback_interval);
      if (typeof callback == "function") {
        callback();
      }
    }
  }, 1000)
  };

window.flitsApp.referFriend = function () {
  var that = this;
  this.getReferralData = function () {
    //     flitsApp.showLoading(window.flitsApp.multilang_refer_friend.refer_page_getting_details, flitsAppJquery("#flits-page-refer-friend"));
    var get_referral_data_url = "/refer_friend/get_referral_data";
    get_referral_data_url = flitsAppJquery('#flits-customer-url').val() + get_referral_data_url;

    flitsAppJquery.ajax({
      url: get_referral_data_url,
      method: "get",
      data: {
        token: flitsAppJquery("#flits-token").val()
      },
      success: function (res) {
        if (res.status) {
          flitsAppJquery('.flits-loading-div').hide();
          flitsAppJquery('.flits-refer-friend-content').show();
          //           flitsAppJquery("#flits-page-refer-friend").toast(window.flitsApp.multilang_refer_friend.refer_page_details_successfully_get);
          var moneyFormat = flitsAppJquery("#flits-shop-money-format").val();
          var customer = res.customer;
          var credit_log = res.customer.credit_log;

          if (customer.referral_code != '') {
            //             flitsAppJquery('.flits-referrer-code').val(customer.referral_code);
            flitsAppJquery('.flits-refferal-code-div').html(customer.referral_code);
            var shareable_link =  "https://"+location.host+"/account/register?flits_refer_code=" + encodeURIComponent(unescape(btoa(customer.referral_code)))+"&flits_inviter_name="+encodeURIComponent(unescape(btoa(customer.name)));
            flitsAppJquery('.flits-referral-link').val(shareable_link);
          } else {
            flitsAppJquery('.flits-referrer-code').val(window.flitsApp.multilang_refer_friend.referral_code_not_available);
            flitsAppJquery('.flits-referrer-code-copy-btn-div').addClass('flits-hidden');
          }
          if (res.refer_by != '') {
            flitsAppJquery('.flits-referee-inner-div').addClass('flits-hidden');
            flitsAppJquery('.flits-refer-by').removeClass('flits-hidden');
            flitsAppJquery('.flits-referred-by').html(res.refer_by);
          }
          if(typeof navigator.share == "function"){
            flitsAppJquery(".flits-referral-navigator-share").removeClass('flits-hidden');
          }
          if(res.facebook_share){
            flitsAppJquery(".flits-referral-facebook-share").removeClass('flits-hidden');
          }
          if(res.whatsapp_share){
            flitsAppJquery(".flits-referral-whatsapp-share").removeClass('flits-hidden');
          }
          var total_earned_credits = 0;
          if (credit_log.length > 0) {
            flitsAppJquery.each(credit_log, function (index, item) {

              var $li = flitsAppJquery('#flits-refer-program-credit-log-template').clone();
              $li.attr('id', "flits-log-" + item.id);

              var credits = item.credits;
              total_earned_credits += credits
              credits = window.flitsApp.multilang.earned + " " + window.flitsApp.formatMoney(Math.abs(credits), moneyFormat).replace(/((\,00)|(\.00))$/g, '');

              $li.find(".flits-referral-customer-credit-col").html(credits);

              var referrer_name = window.flitsApp.multilang_refer_friend.customer_deleted;
              var referrer_email = '--';
              if (item['referrer_customer'] != null) {
                referrer_name = item['referrer_customer'].name;
                referrer_email = item['referrer_customer'].email;
              }
              $li.find(".flits-referral-customer-name-col").html(referrer_name);
              $li.find(".flits-referral-customer-email-col").html(referrer_email).attr("title", referrer_email);
              $li.find(".flits-referral-customer-credit-date-col").html(item.created_at);

              flitsAppJquery('.flits-refer-program-credit-log').append($li);
            });
            flitsAppJquery('.flits-refer-program-credit-history-div').removeClass('flits-hidden');
            flitsAppJquery('.flits-refer-program-credit-history-empty').addClass('flits-hidden');
          } else {
            flitsAppJquery('.flits-refer-program-credit-history-empty').removeClass('flits-hidden');
            flitsAppJquery('.flits-refer-program-credit-history-div').addClass('flits-hidden');
          }
          total_earned_credits = window.flitsApp.formatMoney(Math.abs(total_earned_credits), moneyFormat).replace(/((\,00)|(\.00))$/g, '');
          flitsAppJquery(".flits-refer-program-total-credits").html(total_earned_credits);
        } else {
          var error = '';
          switch (res.error_code) {
            case 2:
            case 3:
              flitsAppJquery('.flits-refer-friend-content').hide();
              flitsAppJquery('.flits-loading-div').show();
              error = window.flitsApp.multilang_refer_friend.loading_message;
              flitsAppJquery('.flits-loading-message').html(error);
              setTimeout(function () {
                that.getReferralData();
              }, 2000);
              break;
            default:
              flitsAppJquery('.flits-nav a[data-href="#flits-page-refer-friend"]').remove();
              flitsAppJquery('#flits-page-refer-friend').remove();
              break;
          }
        }
      },
      error: function (res) {
        switch (res.status) {
          default:
            flitsAppJquery("#flits-page-refer-friend").toast(res.statusText);
            break;
        }
      }
    });
  };
  this.copyReferrerCode = function () {
    flitsAppJquery(".flits-referrer-container").toast(window.flitsApp.multilang_refer_friend.referral_code_copied);
    var $temp = flitsAppJquery(".flits-referral-link");
    $temp.select();
    document.execCommand("copy");
  };
  this.sendReferRequest = function () {
    flitsApp.showLoading(window.flitsApp.multilang_refer_friend.refer_friend_loading, flitsAppJquery(".flits-referee-div"));
    flitsAppJquery(".flits-refer-friend-error-div").addClass('flits-hidden');
    flitsAppJquery(".flits-refer-loader").removeClass('flits-hidden');
    var refer_friend_code = flitsAppJquery("#flits-refer-friend-code").val();
    if (refer_friend_code != '') {
      var refer_request_url = "/refer_friend/send_refer_request";
      refer_request_url = flitsAppJquery('#flits-customer-url').val() + refer_request_url;
      flitsAppJquery.ajax({
        url: refer_request_url,
        method: "POST",
        data: {
          token: flitsAppJquery("#flits-token").val(),
          refer_friend_code: refer_friend_code,
        },
        success: function (res) {
          flitsAppJquery(".flits-refer-loader").addClass('flits-hidden');
          if (res.status) {
            flitsAppJquery(".flits-referee-div").toast(window.flitsApp.multilang_refer_friend.successfully_refer_friend);
            var refer_by = res.data.inviter.name;
            if (refer_by != -1) {
              flitsAppJquery('.flits-enter-referral-code-label').addClass('flits-hidden');
              flitsAppJquery('.flits-referee-inner-div').addClass('flits-hidden');
              flitsAppJquery('.flits-refer-by').removeClass('flits-hidden');
              flitsAppJquery('.flits-referred-by').html(res.refer_by);
            }
          } else {
            flitsAppJquery(".flits-refer-friend-error-div").removeClass('flits-hidden');
            var error = '';
            switch (res.error_code) {
              case 1:
                error = window.flitsApp.multilang_refer_friend.you_can_not_referred_yourself;
                break;
              case 2:
                error = window.flitsApp.multilang_refer_friend.something_went_wrong;
                break;
              case 3:
                error = window.flitsApp.multilang_refer_friend.invalid_referral_code;
                break;
              case 4:
                error = window.flitsApp.multilang_refer_friend.refer_program_not_active;
                break;
              default:
                error = window.flitsApp.multilang_refer_friend.something_went_wrong;
                break;
            }
            flitsAppJquery(".flits-referee-div").toast(error);
          }
        },
        error: function (res) {
          switch (res.status) {
            default:
              //               flitsAppJquery("#flits-page-refer-friend").toast(res.statusText);
              break;
          }
        }
      });

    } else {
      flitsAppJquery(".flits-referee-div").toast(window.flitsApp.multilang_refer_friend.referral_code_is_required);
      flitsAppJquery(".flits-refer-loader").addClass('flits-hidden');
      flitsAppJquery(".flits-refer-friend-error-div").removeClass('flits-hidden');
    }

  };
  this.popupWindow = function(url, title, win, w, h) {
    const y = win.top.outerHeight / 2 + win.top.screenY - ( h / 2);
    const x = win.top.outerWidth / 2 + win.top.screenX - ( w / 2);
    return win.open(url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width='+w+', height='+h+', top='+y+', left='+x);
  }
  this.getReferralData();
  flitsAppJquery(document).on('click', ".flits-send-refer-request-btn", function (event) {
    that.sendReferRequest();
  });
  flitsAppJquery(document).on('click', ".flits-referral-link-copy", function (event) {
    that.copyReferrerCode();
  });
  flitsAppJquery(document).on('click', ".flits-referral-link-share", function (event) {
    var platform = flitsAppJquery(this).attr('data-flits-share-platform');
    var referral_link = flitsAppJquery('.flits-referral-link').val();
    var facebook_description = encodeURIComponent(unescape(window.flitsApp.multilang_refer_friend.referral_program_invitation_message.replace("##link##", '')));
    var encoded_description = encodeURIComponent(unescape(window.flitsApp.multilang_refer_friend.referral_program_invitation_message.replace("##link##", referral_link)));
    var description = window.flitsApp.multilang_refer_friend.referral_program_invitation_message.replace("##link##", referral_link);
    var url = null;
    switch(platform){
      case 'facebook':
        url = "https://www.facebook.com/sharer/sharer.php?u="+encodeURIComponent(unescape(referral_link))+"&quote="+facebook_description;	
        break;
      case 'whatsapp':
        url = "https://api.whatsapp.com/send?text="+encoded_description;
        break;
      case 'navigator_share':
        var data = {
          title: 'Refer Freind',
          text: description
        }
        var sharePromise = navigator.share(data);
        return true;
        break;
      default:
      case 'facebook':
        break;
    }
    if(url){
      that.popupWindow(url,platform.charAt(0).toUpperCase() + platform.slice(1) +" Share",window,700, 700);
      // 			window.open(, "pop", "width=600, height=400, scrollbars=no, top=300, left=500");
    }

  });

};

window.flitsApp.append_anchor_div = function (appent_at) {
  if (location.pathname == "/account") {
    var pages_div = document.querySelector('.flits-pages');

    var div_anchor = document.querySelector('.flits-refer-friend .flits-anchor a');
    var div_div = document.querySelector('.flits-refer-friend .flits-div div');

    if (div_anchor) {

      var list_group_length = document.querySelector('.flits-list-group').children.length;
      var list_group = document.querySelector('.flits-list-group');

      if (appent_at >= list_group_length)
      {
        list_group.insertBefore(div_anchor, list_group.children[list_group_length]);
      } else {
        list_group.insertBefore(div_anchor, list_group.children[appent_at]);
      }
    }
    if (div_div) {
      if (pages_div) {
        pages_div.append(div_div);
      }
    }
    window.flitsApp.run_after_jquery(window.flitsApp.referFriend);
  }
};

if (window.flitsApp.multilang_refer_friend.refer_friend_rule_on && window.flitsApp.multilang_refer_friend.refer_friend_rule_on == 1) {

  window.flitsApp.append_anchor_div(4);
  //   window.flitsApp.run_after_jquery(window.flitsApp.referFriend);
}

var is_new_to_referral = false;

if((!window.flitsApp.isNull(window.flitsApp.getURLParameter('flits_refer_code')) || !window.flitsApp.isNull(window.flitsApp.getCookie('flits-referral-code'))) && window.flitsApp.refer_friend.customer_id == -1){
  is_new_to_referral = true;
}	

if(is_new_to_referral){
  var referral_code = null;
  var flits_inviter_name = '';
  if(!window.flitsApp.isNull(window.flitsApp.getURLParameter('flits_refer_code'))){
    referral_code = atob(window.flitsApp.getURLParameter('flits_refer_code'));
    window.flitsApp.setCookie('flits-referral-code',referral_code,1);
  }
  if(!window.flitsApp.isNull(window.flitsApp.getURLParameter('flits_inviter_name'))){
    flits_inviter_name = atob(window.flitsApp.getURLParameter('flits_inviter_name'));
    window.flitsApp.setCookie('flits-inviter-name',flits_inviter_name,1);
  }
  if(!window.flitsApp.isNull(window.flitsApp.getCookie('flits-referral-code'))){
    referral_code = window.flitsApp.getCookie('flits-referral-code');
  }
  if(!window.flitsApp.isNull(window.flitsApp.getCookie('flits-inviter-name'))){
    flits_inviter_name = window.flitsApp.getCookie('flits-inviter-name');
  }
  window.flitsApp.addContentReferralModal(window.flitsApp.multilang_refer_friend.popup_message.replace(/##inviter_name##/g,flits_inviter_name));
  var is_popup_closed = !window.flitsApp.isNull(window.flitsApp.getCookie('flits-referral-popup-closed'));
  if(!is_popup_closed){
    window.flitsApp.openReferralModal();
  }
  var all_social_login_btns = document.querySelectorAll('.flits-btn');
  for(var i = 0; i < all_social_login_btns.length; i++){
    all_social_login_btns[i].href += "&flits_refer_code="+referral_code;
  }
  var register_form = document.querySelector('form[method="post"][action="/account"]');
  if(register_form){
    var flits_referral_code = document.createElement('input');
    flits_referral_code.type = "hidden";
    flits_referral_code.name = "customer[note][flits_referral_code]";
    flits_referral_code.value = referral_code;
    if(register_form.querySelector('[name="customer[note][flits_referral_code]"]')){
      register_form.querySelector('[name="customer[note][flits_referral_code]"]').value = referral_code;				
    }else{
      register_form.appendChild(flits_referral_code);
    }
  }
  window.history.replaceState({}, document.title, location.protocol +"//" + location.host + location.pathname)
}

if(window.flitsApp.refer_friend.customer_id != -1){
  window.flitsApp.setCookie('flits-referral-code','',-1);
}

document.querySelector(".flits-close").onclick = function() {
  window.flitsApp.closeReferralModal();
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == document.querySelector('#flits-referral-modal')) {
    window.flitsApp.closeReferralModal();
  }
}
