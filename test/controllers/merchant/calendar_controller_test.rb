require "test_helper"

class Merchant::CalendarControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get merchant_calendar_index_url
    assert_response :success
  end

  test "should get feed" do
    get merchant_calendar_feed_url
    assert_response :success
  end
end
