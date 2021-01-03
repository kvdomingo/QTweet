for file in ./lang/*.ftl;
do f=${file%.ftl}; cat $file | envsubst '$BOT_NAME:$PREFIX' > $f.o.ftl; echo "Built $f.o.ftl ";
done
