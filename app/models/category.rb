class Category < ActiveRecord::Base
  extend ActsAsTree::TreeWalker
  has_many :categoryattributes , :dependent => :delete_all
  has_one :categorystyle, :dependent => :delete
  has_one :categoryscope, :dependent => :delete
  has_one :headercategory, :dependent => :delete
  has_many :headervalues , :dependent => :delete_all
  has_one :categorydescription, :dependent => :delete
  acts_as_tree :order => 'title'
  belongs_to :collection
  has_and_belongs_to_many :articles, -> { order('title').uniq }
  attr_accessible :collection_id, :title, :style

  validates :title, presence: true, uniqueness: { scope: [:collection_id, :parent_id] }


#  def destroy_but_attach_children_to_parent
#    self.children.each do |child|
#      child.parent = self.parent
#      child.save!
#    end
#    self.destroy
#  end
end
