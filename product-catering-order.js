var prod_code = [
		{code: 1, name: 'Cooked Tuna', desc: 'Sushi Rolls - Cooked Tuna', price: 2.0, amt: 0, total: 0.0}
		, {code: 2, name: 'Vegetable', desc: 'Sushi Rolls - Vegetable', price: 2.0, amt: 0, total: 0.0}
		, {code: 3, name: 'Fresh Salmon', desc: 'Sushi Rolls - Fresh Salmon', price: 2.20, amt: 0, total: 0.0}
		, {code: 4, name: 'California', desc: 'Sushi Rolls - California', price: 2.0, amt: 0, total: 0.0}
		, {code: 5, name: 'Teriyaki Chicken', desc: 'Sushi Rolls - Teriyaki Chicken', price: 2.0, amt: 0, total: 0.0}
		, {code: 6, name: 'Crispy Chicken', desc: 'Sushi Rolls - Crispy Chicken', price: 2.0, amt: 0, total: 0.0}
		, {code: 7, name: 'Prawn', desc: 'Rice Paper Rolls - Prawn', price: 2.0, amt: 0, total: 0.0}
		, {code: 8, name: 'Chicken', desc: 'Rice Paper Rolls - Chicken', price: 2.0, amt: 0, total: 0.0}
		, {code: 9, name: 'Spicy Pork', desc: 'Rice Paper Rolls - Spicy Pork', price: 2.0, amt: 0, total: 0.0}
		, {code: 10, name: 'Pork', desc: 'Gyoza - Pork', price: 18.0, amt: 0, total: 0.0}
		, {code: 11, name: 'Chicken', desc: 'Gyoza - Chicken', price: 18.0, amt: 0, total: 0.0}
		, {code: 12, name: 'Vegetable', desc: 'GYoza - Vegetable', price: 18.0, amt: 0, total: 0.0}
		, {code: 13, name: 'Platter A Sushi Roll Combo Platter', desc: 'Platter A - Sushi Roll Combo Platter', price: 70.0, amt: 0, total: 0.0}
		, {code: 14, name: 'Platter B Nigiri Combo Platter', desc: 'Platter B - Nigiri Combo Platter', price: 70.0, amt: 0, total: 0.0}
]

var _prefix_prod_name = "#labelName";
var _prefix_prod_amt = "#txtAmt";
var _prefix_prod_total = "#txtTotal";
var _prefix_prod_code = "#hiddenCode";
var _prefix_prod_price = "#hiddenPrice";

var $txtName, $txtTel, $txtEmail, $txtAdd;
var $txtOrderTotal;

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
		
		initMoneyInput(_prefix_prod_total + code, 0, 99999);
		setMoneyInputValue(_prefix_prod_total + code, 0);
		//$(_prefix_prod_total + code).val(0);
		
		$(_prefix_prod_code + code).val(code);
		$(_prefix_prod_name + code).text(name + ' @ $' + price + '');
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
	$txtEmail = $('txtEmail');
	$txtAdd = $('#txtAdd');
	$txtOrderTotal = $('#txtOrderTotal');
	
	initMoneyInput($txtOrderTotal, 0, 999999);
	setMoneyInputValue($txtOrderTotal, 0);
	setProductTouchSpin();
}






