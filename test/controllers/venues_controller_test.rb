require "test_helper"

class VenuesControllerTest < ActionDispatch::IntegrationTest
  test "should get show" do
    get venues_show_url
    assert_response :success
  end

  test "should get photos" do
    get venues_photos_url
    assert_response :success
  end

  test "should get services" do
    get venues_services_url
    assert_response :success
  end

  test "should get reviews" do
    get venues_reviews_url
    assert_response :success
  end
end
