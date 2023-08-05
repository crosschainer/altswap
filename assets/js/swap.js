const detail = JSON.stringify({
    appName: 'AltSwap',
    version: '0.0.1',
    logo: 'logo.png',
    contractName: 'con_rocketswap_official_v1_1',
    networkType: 'mainnet',
    networkName: 'arko' 
})

var address = "";
var assetContract = "con_yeti";
var currencyContract = "currency";
var fromContract = currencyContract;
var toContract = assetContract;
var assetReserves = 0;
var currencyReserves = 0;
var price = 0;
var from_symbol = "";
var to_symbol = "";
var price_2 = 0;
var current_tab = "swap";
var lp_tokens = null;


const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);



$("#swap_tab_menu").click(function () {
    current_tab = "swap";
    $("#swap_tab_menu").addClass("bg-gradient-dark");
    $("#swap_tab_menu").addClass("text-white");
    $("#pools_tab_menu").removeClass("bg-gradient-dark").removeClass("text-white");
    $("#farms_tab_menu").removeClass("bg-gradient-dark").removeClass("text-white");
    $("#launchpad_tab_menu").removeClass("bg-gradient-dark").removeClass("text-white");
    $("#swap_tab").show();
    $("#pools_tab").hide();
    $("#farms_tab").hide();
    $("#launchpad_tab").hide();
    $("#token_selection_menu").show();
});

$("#pools_tab_menu").click(function () {
    current_tab = "pools";
    $("#swap_tab_menu").removeClass("bg-gradient-dark").removeClass("text-white");
    $("#pools_tab_menu").addClass("bg-gradient-dark");
    $("#pools_tab_menu").addClass("text-white");
    $("#farms_tab_menu").removeClass("bg-gradient-dark").removeClass("text-white");
    $("#launchpad_tab_menu").removeClass("bg-gradient-dark").removeClass("text-white");
    $("#swap_tab").hide();
    $("#pools_tab").show();
    $("#farms_tab").hide();
    $("#launchpad_tab").hide();
    $("#token_selection_menu").hide();
});

$("#farms_tab_menu").click(function () {
    current_tab = "farms";
    $("#swap_tab_menu").removeClass("bg-gradient-dark").removeClass("text-white");
    $("#pools_tab_menu").removeClass("bg-gradient-dark").removeClass("text-white");
    $("#farms_tab_menu").addClass("bg-gradient-dark");
    $("#farms_tab_menu").addClass("text-white");
    $("#launchpad_tab_menu").removeClass("bg-gradient-dark").removeClass("text-white");
    $("#swap_tab").hide();
    $("#pools_tab").hide();
    $("#farms_tab").show();
    $("#launchpad_tab").hide();
    $("#token_selection_menu").hide();
});

$("#launchpad_tab_menu").click(function () {
    current_tab = "launchpad";
    $("#swap_tab_menu").removeClass("bg-gradient-dark").removeClass("text-white");
    $("#pools_tab_menu").removeClass("bg-gradient-dark").removeClass("text-white");
    $("#farms_tab_menu").removeClass("bg-gradient-dark").removeClass("text-white");
    $("#launchpad_tab_menu").addClass("bg-gradient-dark");
    $("#launchpad_tab_menu").addClass("text-white");
    $("#swap_tab").hide();
    $("#pools_tab").hide();
    $("#farms_tab").hide();
    $("#launchpad_tab").show();
    $("#token_selection_menu").hide();
});

if (urlParams.has('contract')) {
    assetContract = urlParams.get('contract');
    toContract = urlParams.get('contract');
    $("#to_coinselect").attr("src", "https://static.tauhq.com/file/wwwtauhqcom/img/token_logo/" + assetContract + ".jpg");
}

function timeConverter(UNIX_timestamp) {
    var date = new Date(UNIX_timestamp * 1000);
    return date.toLocaleString()
}

function pullTransactions(contract) {
    $.getJSON("https://rocketswap.exchange:2053/api/get_trade_history?contract_name=" + contract + "&take=10", function (trade_history) {
        var r = new Array(), j = -1;
        for (var key = 0, size = trade_history.length; key < size; key++) {
            if (trade_history[key]["type"] == "buy") {
                r[++j] = '<tr><td class="align-middle text-center"><span class="text-sm font-weight-bold text-success">';
                r[++j] = trade_history[key]["type"].toUpperCase();
            }
            else {
                r[++j] = '<tr><td class="align-middle text-center"><span class="text-sm font-weight-bold text-danger">';
                r[++j] = trade_history[key]["type"].toUpperCase();
            }

            r[++j] = '</span></td><td class="align-middle text-center"><span class="text-sm font-weight-bold">';
            r[++j] = Number(trade_history[key]["amount"]).toFixed(5);
            r[++j] = '</span></td><td class="align-middle text-center"><span class="text-sm font-weight-bold">';
            r[++j] = Number(trade_history[key]["price"]).toFixed(5);
            r[++j] = '</span></td><td class="align-middle text-center"><span class="text-sm font-weight-bold">';
            r[++j] = timeConverter(trade_history[key]["time"]);
            r[++j] = '</span></td></tr>';
        }
        $('#last_transactions').html(r.join(''));
    });
}

function getPairData(from_contract, to_contract) {
    //console.log(from_contract);
    if (from_contract == currencyContract) {
        $.getJSON("https://arko-mn-2.lamden.io/contracts/con_rocketswap_official_v1_1/prices?key=" + to_contract, function (price) {
            $.getJSON("https://arko-mn-2.lamden.io/contracts/con_rocketswap_official_v1_1/reserves?key=" + to_contract, function (reserves) {

                $.getJSON("https://arko-mn-2.lamden.io/contracts/" + to_contract + "/metadata?key=token_symbol", function (symbol) {
                    currencyReserves = Number(reserves['value'][0]["__fixed__"]);
                    assetReserves = Number(reserves['value'][1]["__fixed__"]);
                    price = Number(price["value"]["__fixed__"]).toFixed(8);
                    if (from_contract == currencyContract) {
                        $("#price").text((1 / price).toFixed(8) + " " + symbol["value"] + " PER TAU");

                        from_symbol = "TAU";
                        to_symbol = symbol["value"];
                    }
                    else {
                        $("#price").text(price + " " + symbol["value"] + " PER TAU");
                        from_symbol = symbol["value"];
                        to_symbol = "TAU";
                    }
                    price_2 = (1 / price).toFixed(8)
                    $("#from_symbol").text(from_symbol);
                    $("#to_symbol").text(to_symbol);
                    $("#to_symbol_fee").text(to_symbol);
                });
            });
        });
    }
    else {
        $.getJSON("https://arko-mn-2.lamden.io/contracts/con_rocketswap_official_v1_1/prices?key=" + from_contract, function (price) {
            $.getJSON("https://arko-mn-2.lamden.io/contracts/con_rocketswap_official_v1_1/reserves?key=" + from_contract, function (reserves) {

                $.getJSON("https://arko-mn-2.lamden.io/contracts/" + from_contract + "/metadata?key=token_symbol", function (symbol) {
                    currencyReserves = Number(reserves['value'][0]["__fixed__"]);
                    assetReserves = Number(reserves['value'][1]["__fixed__"]);
                    price = Number(price["value"]["__fixed__"]).toFixed(8);
                    //console.log(from_contract);

                    $("#price").text(price + " TAU PER " + symbol["value"]);
                    from_symbol = symbol["value"];
                    to_symbol = "TAU";
                    price_2 = price;

                    $("#from_symbol").text(from_symbol);
                    $("#to_symbol").text(to_symbol);
                    $("#to_symbol_fee").text(to_symbol);
                });
            });
        });
    }
}


function getLPHoldings(address, token_list_lp) {
    var r = new Array()
    token_list_lp.forEach(token => {
        if (token["has_market"] == true) {

            $.getJSON("https://arko-mn-2.lamden.io/contracts/con_rocketswap_official_v1_1/lp_points?key=" + token["contract_name"] + ":" + address, function (pool_tokens) {
                success = true;
                if (pool_tokens["value"] != null && pool_tokens["value"] != undefined && pool_tokens["value"] != "undefined") {
                    $.getJSON("https://arko-mn-2.lamden.io/contracts/con_rocketswap_official_v1_1/lp_points?key=" + token["contract_name"], function (all_pool_tokens) {
                            $.getJSON("https://arko-mn-2.lamden.io/contracts/con_rocketswap_official_v1_1/reserves?key=" + token["contract_name"], function (reserves) {
                            if (pool_tokens["value"]["__fixed__"] === undefined) {
                                pl_tokens = pool_tokens["value"];
                                all_pl_tokens = all_pool_tokens["value"];
                                percentage = (pl_tokens/all_pl_tokens)*100;
                               
                                full_reserve_tau = Number(reserves['value'][0]["__fixed__"]);
                                full_reserve_token = Number(reserves['value'][1]["__fixed__"]);
                            }
                            else {
                                pl_tokens = Number(pool_tokens["value"]["__fixed__"]).toFixed(8);
                                all_pl_tokens = Number(all_pool_tokens["value"]["__fixed__"]).toFixed(8);
                                percentage = (pl_tokens/all_pl_tokens)*100;
                                full_reserve_tau = Number(reserves['value'][0]["__fixed__"]);
                                full_reserve_token = Number(reserves['value'][1]["__fixed__"]);
                            }
                            console.log(pl_tokens);
                            $('#pool_grid').append('<div class="row p-2"> <div class="col-md-12"><div class="card"> <div class="card-body"> <span class="text-gradient text-primary text-uppercase text-xs font-weight-bold my-2">' + token["contract_name"] + '</span> <a href="javascript:;" class="card-title h5 d-block text-darker"> ' + token["token_name"] + ' </a> <div class="card-description"><div>'+(full_reserve_tau/100*percentage).toFixed(8)+' TAU</div><div>'+(full_reserve_token/100*percentage).toFixed(8)+' '+ token["token_symbol"] + '</div><div>'+percentage.toFixed(2)+'% of Pool</div><div class="mt-2" style="width: 100%;display: flex;justify-content: center;gap: 10px;"><a href="javascript:;" id="add_more_liquidity" class="nav-link text-body font-weight-bold btn bg-gradient-dark ui-state-disabled" style=" color: white !important; margin-bottom: 0; font-weight: 700 !important; "> <i class="fa fa-plus me-sm-1" aria-hidden="true"></i> <span class="d-sm-inline">Add Liquidity</span> </a><a href="javascript:;" id="remove_liquidity" class="nav-link text-body font-weight-bold btn bg-gradient-dark ui-state-disabled" style=" color: white !important; margin-bottom: 0; font-weight: 700 !important; "> <i class="fa fa-minus me-sm-1" aria-hidden="true"></i> <span class="d-sm-inline">Remove Liquidity</span> </a></div></div> </div> </div></div> </div>');
                            });
                    });
                }
            });




        }
    });



}

function getHoldingsOfToken(address) {
    $("#to_symbol_fee").text(to_symbol);
    try {
        $.getJSON("https://arko-mn-2.lamden.io/contracts/" + fromContract + "/balances?key=" + address, function (holdings) {
            try {
                $("#from_balance").text(Number(holdings["value"]["__fixed__"]).toFixed(8));
            }
            catch {
                $("#from_balance").text("0.00000000");
            }
        }).error(function (event, jqxhr, exception) {
            $("#to_balance").text("0.00000000");
        });
    }
    catch {
        $("#from_balance").text("0.00000000");
    }

    try {
        $.getJSON("https://arko-mn-2.lamden.io/contracts/" + toContract + "/balances?key=" + address, function (holdings) {
            try {
                $("#to_balance").text(Number(holdings["value"]["__fixed__"]).toFixed(8));
            }
            catch {
                $("#to_balance").text("0.00000000");
            }
        }).error(function (event, jqxhr, exception) {
            $("#to_balance").text("0.00000000");
        });
    }
    catch {
        $("#to_balance").text("0.00000000");
    }

}

getPairData(currencyContract, assetContract);


document.addEventListener('lamdenWalletInfo', (response) => {
    //console.log(response);
    if (response.detail.errors === undefined) {
        address = response.detail.wallets[0];
        if (response.detail.locked == true) {
            $("#connect_wallet_text").text("Wallet is locked");
            $("#connect_wallet_text_2").text("Wallet is locked");
            $("#connect_wallet_text_3").text("Wallet is locked");
            $("#connect_wallet_text_4").text("Wallet is locked");


            $("#swap").text("Wallet is locked");
            $("#swap").attr("disabled", true).addClass("ui-state-disabled");
        }
        else {
            $("#connect_wallet_text").text("Connected");
            $("#connect_wallet_text_2").text("Connected");
            $("#connect_wallet_text_3").text("Connected");
            $("#connect_wallet_text_4").text("Connected");

            $("#swap").attr("disabled", false).removeClass("ui-state-disabled");
            $("#swap").text("swap");
        }
        getHoldingsOfToken(address);
    }
});

// on window load
window.addEventListener('load', function () {
    document.dispatchEvent(new CustomEvent('lamdenWalletGetInfo'));
});

$("#connect_wallet_text").click(function () {
    document.dispatchEvent(new CustomEvent('lamdenWalletConnect', { detail }));
});



$('#from_input').on('input', function () {
    if (fromContract == "currency") {
        to_val = assetReserves - ((currencyReserves * assetReserves) / (currencyReserves + Number($(this).val())))
        fee = to_val / 100 / 2
        $("#to_input").val((to_val - fee).toFixed(8));
        $("#fee").text(fee.toFixed(8));
        difference = ((price_2 * $(this).val()) - to_val).toFixed(8);
        exp = price_2;
        act = to_val.toFixed(8) / $(this).val();
        slipp = Math.abs((((exp) / (act)) - 1) * 100 * 2.065).toFixed(8);
        $("#slippage").text(Number(slipp).toFixed(2));
    }
    else {
        to_val = currencyReserves - ((currencyReserves * assetReserves) / (assetReserves + Number($(this).val())))
        fee = to_val / 100 / 2
        $("#to_input").val((to_val - fee).toFixed(8));
        $("#fee").text(fee.toFixed(8));
        difference = ((price_2 * $(this).val()) - to_val).toFixed(8);
        exp = price_2;
        act = to_val.toFixed(8) / $(this).val();
        slipp = Math.abs((((1 / exp) / (1 / act)) - 1) * 100 * 2.065).toFixed(8);
        $("#slippage").text(Number(slipp).toFixed(2));
    }
});
$('#to_input').on('input', function () {
    if (fromContract == "currency") {
        from_val = currencyReserves - ((currencyReserves * assetReserves) / (assetReserves + Number($(this).val())))
        fee = from_val / 100 / 2
        $("#from_input").val((from_val - fee).toFixed(8));
        to_val = currencyReserves - ((currencyReserves * assetReserves) / (assetReserves + Number($("#from_input").val())))

        $("#fee").text(((Number($("#to_input").val())) / 100 / 2).toFixed(8));
        difference = ((price_2 * $("#from_input").val()) - to_val).toFixed(8);
        exp = price_2;
        act = to_val.toFixed(8) / $("#from_input").val();
        slipp = Math.abs((((exp) / (act)) - 1) * 100 * 2.065).toFixed(8);
        $("#slippage").text(Number(slipp).toFixed(2));
    }
    else {
        from_val = assetReserves - ((currencyReserves * assetReserves) / (currencyReserves + Number($(this).val())))
        fee = from_val / 100 / 2
        $("#from_input").val((from_val - fee).toFixed(8));
        $("#fee").text(((Number($("#to_input").val())) / 100 / 2).toFixed(8));
        to_val = currencyReserves - ((currencyReserves * assetReserves) / (assetReserves + Number($("#from_input").val())))

        difference = ((price_2 * $(this).val()) - to_val).toFixed(8);
        exp = price_2;
        act = to_val.toFixed(8) / $(this).val();
        slipp = Math.abs((((1 / exp) / (1 / act)) - 1) * 100 * 2.065).toFixed(8);
        $("#slippage").text(Number(slipp).toFixed(2));
    }
});

$("#from_balance").click(function () {
    if (fromContract == "currency") {
        $("#from_input").val($(this).text());
        to_val = assetReserves - ((currencyReserves * assetReserves) / (currencyReserves + Number($(this).text())))
        fee = to_val / 100 / 2
        $("#to_input").val((to_val - fee).toFixed(8));
        $("#fee").text(fee.toFixed(8));
        difference = ((price_2 * $("#from_input").val()) - to_val).toFixed(8);
        exp = price_2;
        act = to_val.toFixed(8) / $("#from_input").val();
        slipp = Math.abs((((exp) / (act)) - 1) * 100 * 2.065).toFixed(8);
        $("#slippage").text(Number(slipp).toFixed(2));
    }
    else {
        $("#from_input").val($(this).text());
        to_val = currencyReserves - ((currencyReserves * assetReserves) / (assetReserves + Number($(this).text())))
        fee = to_val / 100 / 2
        $("#to_input").val((to_val - fee).toFixed(8));
        $("#fee").text(fee.toFixed(8));
        difference = ((price_2 * $(this).text()) - to_val).toFixed(8);
        exp = price_2;
        act = to_val.toFixed(8) / $(this).text();
        slipp = Math.abs((((1 / exp) / (1 / act)) - 1) * 100 * 2.065).toFixed(8);
        $("#slippage").text(Number(slipp).toFixed(2));
    }
});

$("#to_balance").click(function () {
    if (fromContract == "currency") {
        $("#to_input").val($(this).text());
        from_val = currencyReserves - ((currencyReserves * assetReserves) / (assetReserves + Number($(this).text())))
        fee = from_val / 100 / 2
        $("#from_input").val((from_val - fee).toFixed(8));
        $("#fee").text(((Number($("#to_input").val())) / 100 / 2).toFixed(8));
        difference = ((price_2 * $("#from_input").val()) - from_val).toFixed(8);
        exp = price_2;
        act = from_val.toFixed(8) / $("#from_input").val();
        slipp = Math.abs((((exp) / (act)) - 1) * 100 * 2.065).toFixed(8);
        $("#slippage").text(Number(slipp).toFixed(2));
    }
    else {
        $("#to_input").val($(this).text());
        from_val = assetReserves - ((currencyReserves * assetReserves) / (currencyReserves + Number($(this).text())))
        fee = from_val / 100 / 2
        $("#from_input").val((from_val - fee).toFixed(8));
        $("#fee").text(((Number($("#to_input").val())) / 100 / 2).toFixed(8));
        difference = ((price_2 * $(this).text()) - to_val).toFixed(8);
        exp = price_2;
        act = to_val.toFixed(8) / $(this).text();
        slipp = Math.abs((((1 / exp) / (1 / act)) - 1) * 100 * 2.065).toFixed(8);
        $("#slippage").text(Number(slipp).toFixed(2));
    }
});

$("#switch").click(function () {
    temp1 = fromContract;
    temp2 = toContract;

    fromContract = temp2;
    toContract = temp1;

    fromContract_img = $("#from_coinselect").attr("src");
    toContract_img = $("#to_coinselect").attr("src");

    $("#to_coinselect").attr("src", fromContract_img);
    $("#from_coinselect").attr("src", toContract_img);

    temp_symbol_from = from_symbol;
    temp_symbol_to = to_symbol;

    from_symbol = temp_symbol_to;
    to_symbol = temp_symbol_from;

    temp_value_from = $("#from_input").val();
    temp_value_to = $("#to_input").val();

    $("#from_input").val(temp_value_to);
    $("#to_input").val(temp_value_from);

    $("#from_symbol").text(from_symbol);
    $("#to_symbol").text(to_symbol);
    $("#to_symbol_fee").text(to_symbol);

    if (fromContract == "currency") {

        from_val = currencyReserves - ((currencyReserves * assetReserves) / (assetReserves + Number($(this).text())))
        fee = from_val / 100 / 2

        $("#fee").text(((Number($("#to_input").val())) / 100 / 2).toFixed(8));

    }
    else {

        from_val = assetReserves - ((currencyReserves * assetReserves) / (currencyReserves + Number($(this).text())))
        fee = from_val / 100 / 2

        $("#fee").text(((Number($("#to_input").val())) / 100 / 2).toFixed(8));

    }
    getHoldingsOfToken(address);
    getPairData(fromContract, toContract);

});

$("#from_coinselect").click(function () {

    //MicroModal.show('modal-coinselect'); 
});
$("#to_coinselect").click(function () {

    //MicroModal.show('modal-coinselect'); 
});
$.getJSON("https://arko-bs-1.lamden.io/current/all/con_rocketswap_official_v1_1/pairs", function (pools) {
    pools = pools["con_rocketswap_official_v1_1"]["pairs"];
    // pools is a dict with pool names as keys but we need a list of pool names
    pools = Object.keys(pools);
    console.log(pools)
    let r = [];
    let j = 0;
    for (pool in pools) {       
            r[++j] = '<li style="padding-top: 0.5em;padding-bottom: 0.5em;"><a class="dropdown-item" href="' + window.location.pathname.replace('#', '') + '?contract=' + pools[pool] + '" onclick="">'+pools[pool]+'</a></li>';    
    }
    $('#token_dropdown_mobile').html(r.join(''));
    $('#dropdownMenuButton').text("Select Another Pool");    
});

$("#dropdownMenuButton").click(function () {

    if ($(".dropdown-menu").css("opacity") == "0") {
        $(".dropdown-menu").css("opacity", "1");
        $(".dropdown-menu").css("pointer-events", "all");
    }
    else {
        $(".dropdown-menu").css("opacity", "0");
        $(".dropdown-menu").css("pointer-events", "none");
    }
});


$("#swap").click(function () {
    if (fromContract == "currency") {
        const detail = JSON.stringify({
            contractName: 'currency',
            methodName: 'approve',
            networkType: 'mainnet',
            kwargs: {
                amount: Number($("#from_input").val()),
                to: "con_rocketswap_official_v1_1"
            },

            stampLimit: 200,
        });
        document.dispatchEvent(new CustomEvent('lamdenWalletSendTx', { detail }));
    }
    else {
        const detail = JSON.stringify({
            contractName: fromContract,
            methodName: 'approve',
            networkType: 'mainnet',
            kwargs: {
                amount: Number($("#from_input").val()),
                to: "con_rocketswap_official_v1_1"
            },

            stampLimit: 200,
        });
        document.dispatchEvent(new CustomEvent('lamdenWalletSendTx', { detail }));
    }
    $("#swap").attr("disabled", true).addClass("ui-state-disabled");
    $("#swap").text("Waiting for TX Response..");

});
document.addEventListener('lamdenWalletTxStatus', (response) => {
    //console.log(response);
    if (response.detail.data.resultInfo.title == "Transaction Pending" && response.detail.data.txInfo.methodName == "approve") {
        setTimeout(function () {

            $("#swap").text("Waiting for Exchange TX Response..");
            if (fromContract == "currency") {
                const detail = JSON.stringify({
                    contractName: 'con_rocketswap_official_v1_1',
                    methodName: 'buy',
                    networkType: 'mainnet',
                    kwargs: {
                        contract: assetContract,
                        currency_amount: Number($("#from_input").val())
                    },

                    stampLimit: 500,
                });
                document.dispatchEvent(new CustomEvent('lamdenWalletSendTx', { detail }));
            }
            else {
                const detail = JSON.stringify({
                    contractName: 'con_rocketswap_official_v1_1',
                    methodName: 'sell',
                    networkType: 'mainnet',
                    kwargs: {
                        contract: assetContract,
                        token_amount: Number($("#from_input").val())
                    },

                    stampLimit: 500,
                });
                document.dispatchEvent(new CustomEvent('lamdenWalletSendTx', { detail }));
            }


        }, 5000);

    }
    if (response.detail.data.resultInfo.title == "Transaction Pending" && response.detail.data.txInfo.methodName == "buy") {
        setTimeout(function () {


            location.reload();

        }, 2000);

    }
    if (response.detail.data.resultInfo.title == "Transaction Pending" && response.detail.data.txInfo.methodName == "sell") {
        setTimeout(function () {


            location.reload();

        }, 2000);

    }
});