class BusinessPolicy < ApplicationPolicy
  def create?  ; user.present? ; end
  def update?  ; user&.id == record.user_id || user&.role == "admin" ; end
  def show?    ; true ; end
  def index?   ; true ; end
end
