require "test_helper"

class LocationsControllerTest < ActionDispatch::IntegrationTest
  test "should get nearby" do
    get locations_nearby_url
    assert_response :success
  end
end
