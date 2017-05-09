var prod_code = [
		{code: 1, name: 'Cooked Tuna', desc: 'Sushi Rolls - Cooked Tuna', price: 2.0, amt: 0, total: 0.0}
		, {code: 2, name: 'Vegetable', desc: 'Sushi Rolls - Vegetable', price: 2.0, amt: 0, total: 0.0}
		, {code: 3, name: 'Fresh Salmon', desc: 'Sushi Rolls - Fresh Salmon', price: 2.2, amt: 0, total: 0.0}
		, {code: 4, name: 'California', desc: 'Sushi Rolls - California', price: 2.0, amt: 0, total: 0.0}
		, {code: 5, name: 'Teriyaki Chicken', desc: 'Sushi Rolls - Teriyaki Chicken', price: 2.0, amt: 0, total: 0.0}
		, {code: 6, name: 'Crispy Chicken', desc: 'Sushi Rolls - Crispy Chicken', price: 2.0, amt: 0, total: 0.0}
		, {code: 7, name: 'Prawn', desc: 'Rice Paper Rolls - Prawn', price: 2.0, amt: 0, total: 0.0}
		, {code: 8, name: 'Chicken', desc: 'Rice Paper Rolls - Chicken', price: 2.0, amt: 0, total: 0.0}
		, {code: 9, name: 'Spicy Pork', desc: 'Rice Paper Rolls - Spicy Pork', price: 2.0, amt: 0, total: 0.0}
		, {code: 10, name: 'Pork', desc: 'Gyoza - Pork', price: 18.95, amt: 0, total: 0.0}
		, {code: 11, name: 'Chicken', desc: 'Gyoza - Chicken', price: 18.95, amt: 0, total: 0.0}
		, {code: 12, name: 'Vegetable', desc: 'GYoza - Vegetable', price: 18.95, amt: 0, total: 0.0}
		, {code: 13, name: 'Platter A Sushi Roll Combo Platter', desc: 'Platter A - Sushi Roll Combo Platter', price: 70.0, amt: 0, total: 0.0}
		, {code: 14, name: 'Platter B Nigiri Combo Platter', desc: 'Platter B - Nigiri Combo Platter', price: 70.0, amt: 0, total: 0.0}
]

var _minimum_order = 80;
var _message_on_success = "Order details are sent to your email.<br>We will be in contact with you within 24 hrs of order placement. <br> Thank you";
var _message_on_failed = "Sorry, an order cannot be submitted. <br> Please try again or call us.";

var _prefix_prod_name = "#labelName";
var _prefix_prod_amt = "#txtAmt";
var _prefix_prod_total = "#txtTotal";
var _prefix_prod_code = "#hiddenCode";
var _prefix_prod_price = "#hiddenPrice";

var $txtName, $txtTel, $txtEmail, $txtAdd, $btnOrder;
var $txtOrderTotal;
var $alertTop, $alertBottom, $alertMsg;

function initMoneyInput(control, min, max) {
	$(control).autoNumeric('init', { vMin: min, vMax: max, aSign: '$' });
}
function setMoneyInputValue(control, val) {
	$(control).autoNumeric('set', val);
}
function getMoneyInputValue(control) {
	return $(control).autoNumeric('get');
	//return $(control).val().replace(/\$/i, '');
}

function initTouchSpinInput(control, min, max, initVal, step) {
	$(control).TouchSpin({
		verticalbuttons: true,
		initval: initVal,
		min: min,
		max: max,
		step: step
	});
}
function setTouchSpinInputValue(control, val) {
	$(control).val(val);
}
function getTouchSpinInputValue(control) {
	return $(control).val();
}

function setProductTouchSpin() {
	for (var i = 0; i < prod_code.length; i++) {
		//alert(_prefix_prod_amt + prod_code[i]['code']);
		code = prod_code[i]['code'];
		name = prod_code[i]['name'];
		desc = prod_code[i]['desc'];
		price = prod_code[i]['price'];
		
		initMoneyInput(_prefix_prod_total + code, 0, 99999.99);
		setMoneyInputValue(_prefix_prod_total + code, 0);
		//$(_prefix_prod_total + code).val(0);
		
		$(_prefix_prod_code + code).val(code);
		$(_prefix_prod_name + code).text(name + ' @ $' + price.toFixed(2) + '');
		$(_prefix_prod_price + code).val(price);
		
		// store the code in the "name" property
		initTouchSpinInput(_prefix_prod_amt + code, 0, 9999, 0, 1);
		$(_prefix_prod_amt + code).prop('name', code);
		bindPriceChange(_prefix_prod_amt + code);
	}
}

function bindPriceChange(control) {
	$(control).change(function(){
		code = $(this).prop('name');
		calProductTotal(control, code);
	});
}

function calProductTotal(control, code) {
	amt = getTouchSpinInputValue(control);
	price = $(_prefix_prod_price + code).val();
	total = amt * price;
	
	//$(_prefix_prod_total + code).val(total);
	setMoneyInputValue(_prefix_prod_total + code, total);
	
	setOrderTotal(calOrderTotal());
}

function calOrderTotal() {
	orderTotal = 0.0;
	for (var i = 0; i < prod_code.length; i++) {
		//prodTotal = parseFloat($(_prefix_prod_total + prod_code[i]['code']).val());
		prodTotal = parseFloat(getMoneyInputValue(_prefix_prod_total + prod_code[i]['code']));
		orderTotal += prodTotal;
	}
	
	return orderTotal;
	
}

function setOrderTotal(total) {
	setMoneyInputValue($txtOrderTotal, total);
}

function initPage()
{
	$txtName = $('#txtName');
	$txtTel = $('#txtTel');
	$txtEmail = $('#txtEmail');
	$txtAdd = $('#txtAdd');
	$txtOrderTotal = $('#txtOrderTotal');
	$btnOrder = $('#btnOrder');
	$alertTop = $('#alertTop');
	$alertBottom = $('#alertBottom');
	$alertMsg = $('.alert-msg');
	
	//$txtEmail.inputmask('email');
	//$txtTel.inputmask('9999-999-999'); // .inputmask("isComplete")
	
	$btnOrder.click(function(){
		confirmOrder();
	});
	
	initMoneyInput($txtOrderTotal, 0, 999999.99);
	setMoneyInputValue($txtOrderTotal, 0);
	setProductTouchSpin();
	
	hideAlert();
}

function confirmOrder() {
	if (validateCustomerDetails()) {
		if (checkMinimumOrder()) {
			if (isCaptchaSolved()) {
				hideAlert();
				disableOrderButton();
				submitOrder();
			} else {
				showAlertBottom('Please identify yourself, if you are not a bot');
			}
		} else {
			showAlertBottom('The minimum order value is $' + _minimum_order);
		}
	}
}

function isCaptchaSolved() {
	response = grecaptcha.getResponse();
	if (response.length)
		return response;
	else
		return false;
}

function showAlertTop(msg, control) {
	$alertMsg.text(msg);
	$alertTop.removeClass('hidden');
	
	if (typeof(control) !== 'undefined' )
		$(control).focus();
}

function showAlertBottom(msg) {
	$alertMsg.text(msg);
	$alertBottom.removeClass('hidden');
}

function hideAlert() {
	$alertTop.addClass('hidden');
	$alertBottom.addClass('hidden');
}

function validateCustomerDetails() {
	if ($txtName.val().trim().length) {
		if ($txtTel.val().trim().length) {
			if ($txtEmail.val().trim().length) {
				if ($txtAdd.val().trim().length) {
					hideAlert();
					return true;
				} else {
					showAlertTop('Please enter your addess', $txtAdd);
				}
			} else {
				showAlertTop('Please enter your email', $txtEmail);
			}
		} else {
			showAlertTop('Please enter your contact number', $txtTel);
		}
	} else {
		showAlertTop('Please enter your name', $txtName);
	}
	
	return false;
}

function checkMinimumOrder() {
	total = getMoneyInputValue($txtOrderTotal);
	
	if (total >= _minimum_order) 
		return true;
	else
		return false;
}

function clearOrderInputs() {
	for (var i = 0; i < prod_code.length; i++) {
		code = prod_code[i]['code'];
		setTouchSpinInputValue(_prefix_prod_amt + code, 0);
		setMoneyInputValue(_prefix_prod_total + code, 0);
	}
	
	setMoneyInputValue($txtOrderTotal, 0);
}

function disableOrderButton() {
	$btnOrder.prop('disabled', 'true');
}
function enableOrderButton() {
	$btnOrder.prop('disabled', '');
}

function submitOrder() {
	orderItems = '<table style="box-sizing: border-box; font-size: 14px; width: 500px; margin: 0 auto; padding: 0;" cellspacing="0" cellpadding="0"><tbody>';
	
	for (var i = 0; i < prod_code.length; i++) {
		amt = parseFloat(getTouchSpinInputValue(_prefix_prod_amt + prod_code[i]['code']));
		if (amt > 0) {
			desc = prod_code[i]['desc'];
			price = prod_code[i]['price'];
			total = getMoneyInputValue(_prefix_prod_total + prod_code[i]['code']);
			
			orderItems += '<tr style="width:500px">'
			orderItems += '<td style="box-sizing: border-box; font-size: 14px; vertical-align: top; border-top-width: 1px; border-top-color: #eee; border-top-style: solid; margin: 0; padding: 5px 0;" valign="top" width="45%">' + desc + ' @ $' + price + '</td>';
			orderItems += '<td style="box-sizing: border-box; font-size: 14px; vertical-align: top; text-align: right; border-top-width: 1px; border-top-color: #eee; border-top-style: solid; margin: 0; padding: 5px 0;" align="right" valign="top" width="20%">' + amt + '</td>';
			orderItems += '<td style="box-sizing: border-box; font-size: 14px; vertical-align: top; text-align: right; border-top-width: 1px; border-top-color: #eee; border-top-style: solid; margin: 0; padding: 5px 0;" align="right" valign="top" width="35%">$' + total + '</td>';
			orderItems += '</tr>';
		}		
	}
	
	orderItems += '</tbody></table>';
	
	//alert(orderItems);
	sendEmail(orderItems);
}

function sendEmail(orderItems) {
	emailjs.send("gmail", "order_form"
		, {
			"cus_email": $txtEmail.val()
			,"cus_name": $txtName.val()
			,"order_date": moment().format("D MMMM YYYY")
			,"order_time": moment().format("h:mm:ss a")
			,"cus_tel": $txtTel.val()
			,"cus_address": $txtAdd.val()
			,"order_items": orderItems
			,"order_total": getMoneyInputValue($txtOrderTotal)
		}
	).then(function(response) {
		onSendMailSuccess(response);
	}, function(err) {
		onSendMailFailed(err);
	});
}

function onSendMailSuccess(response) {
	clearOrderInputs();
	enableOrderButton();
	
	showMessage(_message_on_success, function() {
		window.location.reload();
	});
	
	//alert("SUCCESS. status=" + response.status + ", text=" + response.text);
}

function onSendMailFailed(err) {
	enableOrderButton();
	
	showMessage(_message_on_failed, function() {});
	//alert("FAILED. error=" + err);
}

function showMessage(msg, callback) {
	BootstrapDialog.alert({
		size: BootstrapDialog.SIZE_LARGE,
        title: 'Order Comfirmation',
        message: msg,
        closable: true,
        onhide: callback 
    });
}










