<div class="mention-side">

    <h3 class="feedback_h3">Ваши отзывы об авто</h3>
    @foreach($reviews as $review)
        <div class="mention-block">
            <div class="mention-block_header">
                @if(!empty($review->make->icon))
                    <img src="/{{$review->make->icon}}">
                @endif
                <a href="{{ route('mention', ['type' => $review->type->name,'id' => $review->slug, 'make' => $review->make->name, 'model' => $review->model->name]) }}"> <?= $review->make->title .'/'. $review->model->title?></a>
            </div>
            <div class="mention-block_body">
                "<?= str_limit($review->header) ?>"
            </div>
            <div class="mention-block_date">
                <?= $review->created_at->format('d.m.Y'); ?>
            </div>
        </div>
    @endforeach
</div>