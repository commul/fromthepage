class DisplayController < ApplicationController
  public :render_to_string

  protect_from_forgery :except => [:set_note_body]

  PAGES_PER_SCREEN = 5

  def read_work
    if params.has_key?(:work_id)
      @work = Work.find_by(id: params[:work_id])
    elsif params.has_key?(:url)
      @work = Work.find_by_id(params[:url][:work_id])
    end
    @total = @work.pages.count
    if @article
      # restrict to pages that include that subject
      redirect_to :action => 'read_all_works', :article_id => @article.id, :page => 1 and return
    else
      if params['needs_review']
        condition = "work_id = ? AND status = ?"
        @pages = Page.order('position').where(condition, params[:work_id], 'review').paginate(page: params[:page], per_page: PAGES_PER_SCREEN)
        @count = @pages.count
      elsif params['translation_review']
        condition = "work_id = ? AND translation_status = ?"
        @pages = Page.order('position').where(condition, params[:work_id], 'review').paginate(page: params[:page], per_page: PAGES_PER_SCREEN)
        @count = @pages.count
      else
        @pages = Page.order('position').where(:work_id => @work.id).paginate(page: params[:page], per_page: PAGES_PER_SCREEN)
        @count = @pages.count
      end
    end
  end

  def read_all_works
    if @article
      # restrict to pages that include that subject
      @pages = Page.order('work_id, position').joins('INNER JOIN page_article_links pal ON pages.id = pal.page_id').where([ 'pal.article_id = ?', @article.id ]).paginate(page: params[:page], per_page: PAGES_PER_SCREEN)
      @pages.uniq!
    else
      @pages = Page.paginate :all, :page => params[:page],
                                        :order => 'work_id, position',
                                        :per_page => 5
    end
  end
=begin
def needs_review
  redirect_to action: 'read_work', work_id: @work.id
end

=end
  def search
    if @article
      # get the unique search terms
      terms = []
      @search_string = ""
      @article.page_article_links.each do |link|
        terms << link.display_text.gsub(/\s+/, ' ')
      end
      terms.uniq!
      # process them for display and search
      terms.each do |term|
        # don't add required text
        if term.match(/ /)
          @search_string += "\"#{term}\" "
        else
          @search_string += term + "* "
        end
      end
      if params[:unlinked_only]
        conditions =
          ["works.collection_id = ? "+
          "AND MATCH(search_text) AGAINST(? IN BOOLEAN MODE)"+
          " AND pages.id not in "+
          "    (SELECT page_id FROM page_article_links WHERE article_id = ?)",
          @collection.id,
          @search_string,
          @article.id]

      else
        conditions =
          ["works.collection_id = ? "+
          "AND MATCH(search_text) AGAINST(? IN BOOLEAN MODE)",
          @collection.id,
          @search_string]
      end
      @pages = Page.order('work_id, position').joins(:work).where(conditions).paginate(page: params[:page])
    else
      @search_string = params[:search_string]
      # convert 'natural' search strings unless they're precise
      unless @search_string.match(/["+-]/)
        @search_string.gsub!(/(\S+)/, '+\1*')
      end
      # restrict to pages that include that subject
      @pages = Page.order('work_id, position').joins(:work).where(["works.collection_id = ? AND MATCH(search_text) AGAINST(? IN BOOLEAN MODE)", @collection.id, @search_string]).paginate(page: params[:page])
    end
    logger.debug "DEBUG #{@search_string}"
  end


end