$(document).ready(function () {
    // Init
    console.log("This one is called immediately");
    $('.image-section').hide();
    $('.loader').hide();
    $('#result').hide();

    $('.image-section-2').hide();
    $('.loader-2').hide();
    $('#result-2').hide();

    // Upload Preview
    function readURL(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                $('#imagePreview').css('background-image', 'url(' + e.target.result + ')');
                $('#imagePreview').hide();
                $('#imagePreview').fadeIn(650);
            }
            reader.readAsDataURL(input.files[0]);
        }
    }

    $("#imageUpload").change(function () {
        $('.image-section').show();
        $('#btn-predict').show();
        $('#result').text('');
        $('#result').hide();
        readURL(this);
    });

    // Predict
    $('#btn-predict').click(function () {
        var form_data = new FormData($('#upload-file')[0]);

        // Show loading animation
        $(this).hide();
        $('.loader').show();

        // Make prediction by calling api /predict
        $.ajax({
            type: 'POST',
            url: '/predict',
            data: form_data,
            contentType: false,
            cache: false,
            processData: false,
            async: true,
            success: function (data) {
                // Get and display the result
                $('.loader').hide();
                $('#result').fadeIn(600);
                $('#result').text(' Result:  ' + data);
                console.log('Success!');
            },
        });
    });


    ////////////////////////
    //for n-z
    

    // Upload Preview
    function readURL2(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                $('#imagePreview-2').css('background-image', 'url(' + e.target.result + ')');
                $('#imagePreview-2').hide();
                $('#imagePreview-2').fadeIn(650);
            }
            reader.readAsDataURL(input.files[0]);
        }
    }

    $("#imageUpload-2").change(function () {
        $('.image-section-2').show();
        $('#btn-predict-2').show();
        $('#result-2').text('');
        $('#result-2').hide();
        readURL2(this);
    });

    // Predict
    $('#btn-predict-2').click(function () {
        var form_data = new FormData($('#upload-file-2')[0]);

        // Show loading animation
        $(this).hide();
        $('.loader-2').show();

        // Make prediction by calling api /predict
        $.ajax({
            type: 'POST',
            url: '/predict-2',
            data: form_data,
            contentType: false,
            cache: false,
            processData: false,
            async: true,
            success: function (data) {
                // Get and display the result
                $('.loader-2').hide();
                $('#result-2').fadeIn(600);
                $('#result-2').text(' Result:  ' + data);
                console.log('Success!');
            },
        });
    });

});