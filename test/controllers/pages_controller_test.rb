require "test_helper"

class PagesControllerTest < ActionDispatch::IntegrationTest
  test "should get for_business" do
    get pages_for_business_url
    assert_response :success
  end
end
